'use server';

import { revalidatePath } from 'next/cache';
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

    revalidatePath('/forum');
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
