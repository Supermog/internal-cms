-- Create invites table
CREATE TABLE public.invites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(32) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE NULL,
    user_id UUID NULL REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_invites_email ON public.invites(email);
CREATE INDEX idx_invites_code ON public.invites(code);
CREATE INDEX idx_invites_status ON public.invites(status);
CREATE INDEX idx_invites_created_by ON public.invites(created_by);

-- Enable Row Level Security (RLS)
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can only see invites they created
CREATE POLICY "Users can view their own invites" ON public.invites
    FOR SELECT USING (created_by = auth.uid());

-- Users can create invites
CREATE POLICY "Users can create invites" ON public.invites
    FOR INSERT WITH CHECK (created_by = auth.uid());

-- Users can update their own invites
CREATE POLICY "Users can update their own invites" ON public.invites
    FOR UPDATE USING (created_by = auth.uid());

-- Users can delete their own invites
CREATE POLICY "Users can delete their own invites" ON public.invites
    FOR DELETE USING (created_by = auth.uid());

-- Allow service role to bypass RLS (for API operations)
CREATE POLICY "Service role can manage all invites" ON public.invites
    FOR ALL USING (current_setting('role') = 'service_role');

-- Add a trigger to automatically mark expired invites
CREATE OR REPLACE FUNCTION mark_expired_invites()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.invites
    SET status = 'expired'
    WHERE status = 'pending'
    AND expires_at < NOW();
END;
$$;

-- Create a function to run periodically (you can set this up as a cron job)
-- For now, you can run this manually or call it from your API
COMMENT ON FUNCTION mark_expired_invites() IS 'Marks pending invites as expired if past expiration date';
