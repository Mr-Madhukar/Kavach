/** @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import HomeDashboard from '../home/page';

// Mock the Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock NextAuth
vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}));

// Mock global fetch
global.fetch = vi.fn();

describe('HomeDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: () => Promise.resolve({ reports: [] }),
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the main dashboard elements correctly', () => {
    render(<HomeDashboard />);
    
    // Check for title
    expect(screen.getByText('Kavach')).toBeTruthy();
    
    // Check for main actions
    expect(screen.getByLabelText('Trigger SOS emergency alert')).toBeTruthy();
    expect(screen.getByLabelText('Initiate fake call')).toBeTruthy();
    expect(screen.getByLabelText('Plan safe route')).toBeTruthy();
    expect(screen.getByLabelText('Start Journey Shield')).toBeTruthy();
    expect(screen.getByLabelText('Report an incident')).toBeTruthy();
  });

  it('activates the SOS alert when the main button is clicked', async () => {
    render(<HomeDashboard />);
    
    const sosButton = screen.getByLabelText('Trigger SOS emergency alert');
    fireEvent.click(sosButton);
    
    // Should display safe point information
    await waitFor(() => {
      expect(screen.getByText('Your trusted contacts have been notified')).toBeTruthy();
      expect(screen.getByText('Nearest Safe Points')).toBeTruthy();
    });
    
    // Safe points should be listed
    expect(screen.getByText('Sharma Medical Store')).toBeTruthy();
  });

  it('allows canceling the SOS alert by marking safe', async () => {
    render(<HomeDashboard />);
    
    // Trigger SOS
    fireEvent.click(screen.getByLabelText('Trigger SOS emergency alert'));
    
    // Mark as safe
    const safeButton = await screen.findByLabelText('Cancel alert and mark as safe');
    fireEvent.click(safeButton);
    
    // The alert UI should disappear
    await waitFor(() => {
      expect(screen.queryByText('Your trusted contacts have been notified')).toBeNull();
    });
  });

  it('opens the report modal when the report button is clicked', async () => {
    render(<HomeDashboard />);
    
    const reportButton = screen.getByLabelText('Report an incident');
    fireEvent.click(reportButton);
    
    // Modal should open
    await waitFor(() => {
      expect(screen.getByText('Report an Incident')).toBeTruthy();
      expect(screen.getByLabelText('Report harassment or unsafe person')).toBeTruthy();
      expect(screen.getByLabelText('Report poor lighting or dark area')).toBeTruthy();
    });
  });
});
