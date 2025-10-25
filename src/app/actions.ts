// Client-side API functions (converted from Server Actions for static export)

// Note: revalidatePath is not available in static export, removed
import { ForumPost, Feedback } from '@/types/index';

const API_BASE_URL = 'http://127.0.0.1:5001/api';

// Forum Actions
export async function createForumPost(formData: { title: string; content: string; author: string; }) {
  try {
    const response = await fetch(`${API_BASE_URL}/forum`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to create forum post');
    }

    // revalidatePath not available in static export
    return { success: true };
  } catch (error) {
    console.error("Error creating forum post:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function getForumPosts(): Promise<{ posts?: ForumPost[], error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/forum`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Error fetching forum posts: ${response.statusText}`);
    }
    const posts: ForumPost[] = await response.json();
    return { posts };
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Feedback Actions
export async function getFeaturedFeedback(): Promise<{ feedback?: Feedback[], error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Error fetching feedback: ${response.statusText}`);
      }
      const feedback: Feedback[] = await response.json();
      return { feedback };
    } catch (error) {
      console.error("Error fetching feedback:", error);
      return { error: error instanceof Error ? error.message : "Unknown error" };
    }
}

// Missing functions for appointments and forum
export async function saveBooking(bookingData: any) {
  try {
    // Placeholder implementation
    console.log('Booking saved:', bookingData);
    return { success: true };
  } catch (error) {
    console.error("Error saving booking:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function getForumPost(postId: string) {
  try {
    // Placeholder implementation
    return { 
      id: postId, 
      title: 'Sample Post', 
      content: 'Sample content',
      author: 'Sample Author',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching forum post:", error);
    return null;
  }
}

export async function getReplies(postId: string) {
  try {
    // Placeholder implementation
    return [];
  } catch (error) {
    console.error("Error fetching replies:", error);
    return [];
  }
}

export async function createReply(replyData: any) {
  try {
    // Placeholder implementation
    console.log('Reply created:', replyData);
    return { success: true };
  } catch (error) {
    console.error("Error creating reply:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
