-- Create notifications table for performance ticker
-- Run this in your Supabase SQL Editor

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  type VARCHAR(100),
  ticker_status VARCHAR(20) DEFAULT 'blue' CHECK (ticker_status IN ('red', 'yellow', 'orange', 'green', 'blue', 'slate')),
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for development
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_ticker_status ON notifications(ticker_status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_active ON notifications(is_active);

-- Insert sample notifications for testing
INSERT INTO notifications (message, type, ticker_status, priority) VALUES
('System maintenance completed successfully', 'System', 'green', 1),
('New security incident reported at Site Alpha', 'Security', 'red', 3),
('Training session scheduled for tomorrow', 'Training', 'blue', 2),
('Equipment inspection due this week', 'Maintenance', 'yellow', 2),
('Compliance audit passed with 98% score', 'Compliance', 'green', 1),
('Weather alert: Severe conditions expected', 'Weather', 'orange', 3),
('New employee onboarding completed', 'HR', 'blue', 1),
('Backup system verification successful', 'System', 'green', 1),
('Emergency contact list updated', 'Admin', 'slate', 1),
('Monthly security briefing scheduled', 'Security', 'blue', 2)
ON CONFLICT (id) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_notifications_updated_at();

-- Verify the table was created
SELECT 'Notifications table created successfully!' as status; 