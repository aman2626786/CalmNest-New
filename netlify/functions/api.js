const { Pool } = require('pg');

// Database connection with better error handling
let pool;

const initializePool = () => {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('DATABASE_URL environment variable is not set');
      return null;
    }

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: 1, // Limit connections for serverless
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('Database pool error:', err);
    });
  }
  
  return pool;
};

// Helper function for CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

// Helper function for responses
const createResponse = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: { ...corsHeaders, ...headers },
  body: JSON.stringify(body)
});

exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, {});
  }

  try {
    // Initialize database connection
    const dbPool = initializePool();
    
    if (!dbPool) {
      console.error('Failed to initialize database connection');
      return createResponse(500, { 
        error: 'Database connection failed',
        details: 'DATABASE_URL not configured'
      });
    }

    const path = event.path.replace('/.netlify/functions/api', '');
    const method = event.httpMethod;
    let body = null;
    
    try {
      body = event.body ? JSON.parse(event.body) : null;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return createResponse(400, { error: 'Invalid JSON in request body' });
    }
    
    const queryParams = event.queryStringParameters || {};

    console.log(`API Request: ${method} ${path}`, { body, queryParams });

    // Health check endpoint
    if (path === '/health' && method === 'GET') {
      return createResponse(200, { 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: !!process.env.DATABASE_URL
      });
    }

    // Dashboard API
    if (path.startsWith('/dashboard/') && method === 'GET') {
      const email = path.split('/dashboard/')[1];
      
      try {
        // Get user profile by email
        const userResult = await dbPool.query('SELECT * FROM profile WHERE email = $1', [email]);
        
        if (userResult.rows.length === 0) {
          return createResponse(200, {
            test_submissions: [],
            mood_groove_results: [],
            breathing_exercises: [],
            comprehensive_assessments: [],
            facial_analysis_sessions: [],
            test_count: 0,
            comprehensive_assessments_count: 0,
            total_sessions: 0,
            user_profile: null
          });
        }

        const user = userResult.rows[0];
        const userId = user.id;

        // Fetch all user data with error handling
        let testSubmissions = { rows: [] };
        let moodResults = { rows: [] };
        let breathingLogs = { rows: [] };
        let comprehensiveAssessments = { rows: [] };

        try {
          testSubmissions = await dbPool.query('SELECT * FROM test_submission WHERE user_id = $1 ORDER BY timestamp DESC', [userId]);
        } catch (err) {
          console.warn('Test submissions query failed:', err.message);
        }

        try {
          moodResults = await dbPool.query('SELECT * FROM mood_groove_result WHERE user_id = $1 OR user_email = $2 ORDER BY timestamp DESC', [userId, email]);
        } catch (err) {
          console.warn('Mood results query failed:', err.message);
        }

        try {
          breathingLogs = await dbPool.query('SELECT * FROM breathing_exercise_log WHERE user_id = $1 ORDER BY timestamp DESC', [userId]);
        } catch (err) {
          console.warn('Breathing logs query failed:', err.message);
        }

        try {
          comprehensiveAssessments = await dbPool.query('SELECT * FROM comprehensive_assessment WHERE user_id = $1 ORDER BY timestamp DESC', [userId]);
        } catch (err) {
          console.warn('Comprehensive assessments query failed:', err.message);
        }

        return createResponse(200, {
          test_submissions: testSubmissions.rows,
          mood_groove_results: moodResults.rows,
          breathing_exercises: breathingLogs.rows,
          comprehensive_assessments: comprehensiveAssessments.rows,
          facial_analysis_sessions: [],
          test_count: testSubmissions.rows.length,
          comprehensive_assessments_count: comprehensiveAssessments.rows.length,
          total_sessions: 0,
          user_profile: user
        });

      } catch (dbError) {
        console.error('Database error:', dbError);
        return createResponse(500, { error: 'Database error' });
      }
    }

    // Forum API
    if (path === '/forum' && method === 'GET') {
      try {
        const result = await dbPool.query('SELECT * FROM forum_post WHERE is_approved = true ORDER BY timestamp DESC');
        return createResponse(200, result.rows);
      } catch (dbError) {
        console.error('Forum fetch error:', dbError);
        return createResponse(500, { error: 'Failed to fetch forum posts' });
      }
    }

    if (path === '/forum' && method === 'POST') {
      try {
        const { userId, title, content, author, category } = body;
        
        const result = await dbPool.query(
          'INSERT INTO forum_post (user_id, title, content, author, category, is_approved) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [userId, title, content, author || 'Anonymous', category || 'General', true]
        );

        return createResponse(201, { 
          message: 'Forum post created successfully',
          id: result.rows[0].id 
        });
      } catch (dbError) {
        console.error('Forum post creation error:', dbError);
        return createResponse(500, { error: 'Failed to create forum post' });
      }
    }

    // Feedback API
    if (path === '/feedback' && method === 'GET') {
      try {
        const result = await pool.query('SELECT * FROM feedback WHERE is_featured = true ORDER BY timestamp DESC');
        return createResponse(200, result.rows);
      } catch (dbError) {
        console.error('Feedback fetch error:', dbError);
        return createResponse(500, { error: 'Failed to fetch feedback' });
      }
    }

    if (path === '/feedback' && method === 'POST') {
      try {
        const { userId, userName, feedback_text, rating } = body;
        
        const result = await pool.query(
          'INSERT INTO feedback (user_id, user_name, feedback_text, rating, is_featured) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [userId, userName || 'Anonymous', feedback_text, rating, true]
        );

        return createResponse(201, { 
          message: 'Feedback submitted successfully',
          id: result.rows[0].id 
        });
      } catch (dbError) {
        console.error('Feedback creation error:', dbError);
        return createResponse(500, { error: 'Failed to submit feedback' });
      }
    }

    // Test Submission API
    if (path === '/test-submission' && method === 'POST') {
      try {
        const { userId, test_type, score, severity, answers } = body;
        
        const result = await pool.query(
          'INSERT INTO test_submission (user_id, test_type, score, severity, answers) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [userId, test_type, score, severity, JSON.stringify(answers)]
        );

        return createResponse(201, { message: 'Test submission saved successfully' });
      } catch (dbError) {
        console.error('Test submission error:', dbError);
        return createResponse(500, { error: 'Failed to save test submission' });
      }
    }

    // Mood Groove API
    if (path === '/mood-groove' && method === 'POST') {
      try {
        const { userId, userEmail, dominantMood, confidence, depression, anxiety, expressions } = body;
        
        const result = await pool.query(
          'INSERT INTO mood_groove_result (user_id, user_email, dominant_mood, confidence, depression, anxiety, expressions) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [userId, userEmail, dominantMood, confidence, depression, anxiety, JSON.stringify(expressions)]
        );

        return createResponse(201, { 
          message: 'Mood groove result saved successfully',
          id: result.rows[0].id 
        });
      } catch (dbError) {
        console.error('Mood groove save error:', dbError);
        return createResponse(500, { error: 'Failed to save mood groove result' });
      }
    }

    // Breathing Exercise API
    if (path === '/breathing-exercise' && method === 'POST') {
      try {
        const { userId, exercise_name, duration_seconds } = body;
        
        const result = await pool.query(
          'INSERT INTO breathing_exercise_log (user_id, exercise_name, duration_seconds) VALUES ($1, $2, $3) RETURNING *',
          [userId, exercise_name, duration_seconds]
        );

        return createResponse(201, { message: 'Breathing exercise logged successfully' });
      } catch (dbError) {
        console.error('Breathing exercise log error:', dbError);
        return createResponse(500, { error: 'Failed to log breathing exercise' });
      }
    }

    // Comprehensive Assessment APIs
    if (path === '/comprehensive-assessment' && method === 'POST') {
      try {
        const { userId, sessionId } = body;
        
        const result = await pool.query(
          'INSERT INTO comprehensive_assessment (user_id, session_id) VALUES ($1, $2) RETURNING *',
          [userId, sessionId || `session_${Date.now()}`]
        );

        return createResponse(201, { 
          message: 'Comprehensive assessment created successfully',
          session_id: result.rows[0].session_id,
          assessment_id: result.rows[0].id
        });
      } catch (dbError) {
        console.error('Assessment creation error:', dbError);
        return createResponse(500, { error: 'Failed to create assessment' });
      }
    }

    // Profile API
    if (path.startsWith('/profile/') && method === 'GET') {
      const userId = path.split('/profile/')[1];
      
      try {
        const result = await dbPool.query('SELECT * FROM profile WHERE id = $1', [userId]);
        
        if (result.rows.length === 0) {
          return createResponse(404, { error: 'Profile not found' });
        }

        return createResponse(200, result.rows[0]);
      } catch (dbError) {
        console.error('Profile fetch error:', dbError);
        return createResponse(500, { error: 'Failed to fetch profile' });
      }
    }

    // Profile Update API
    if (path.startsWith('/profile/') && method === 'PUT') {
      const userId = path.split('/profile/')[1];
      
      try {
        const { email, full_name, age, gender } = body;
        
        // First check if profile exists
        const existingProfile = await dbPool.query('SELECT * FROM profile WHERE id = $1', [userId]);
        
        if (existingProfile.rows.length === 0) {
          // Create new profile
          const result = await dbPool.query(
            'INSERT INTO profile (id, email, full_name, age, gender) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, email, full_name, age, gender]
          );
          
          return createResponse(201, { 
            message: 'Profile created successfully',
            profile: result.rows[0]
          });
        } else {
          // Update existing profile
          const result = await dbPool.query(
            'UPDATE profile SET email = $2, full_name = $3, age = $4, gender = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
            [userId, email, full_name, age, gender]
          );
          
          return createResponse(200, { 
            message: 'Profile updated successfully',
            profile: result.rows[0]
          });
        }
      } catch (dbError) {
        console.error('Profile update error:', dbError);
        return createResponse(500, { error: 'Failed to update profile' });
      }
    }

    // Default 404 response
    return createResponse(404, { error: 'Endpoint not found', path, method });

  } catch (error) {
    console.error('API Error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};