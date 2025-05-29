
-- Create meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizador TEXT NOT NULL,
    convidados TEXT[] NOT NULL DEFAULT '{}',
    data_reuniao DATE NOT NULL,
    horario_reuniao TIME NOT NULL,
    link_gravacao TEXT DEFAULT '',
    transcricao TEXT DEFAULT '',
    resumo TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meetings_data_reuniao ON public.meetings(data_reuniao DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_organizador ON public.meetings(organizador);
CREATE INDEX IF NOT EXISTS idx_meetings_created_at ON public.meetings(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow public read access (você pode ajustar conforme necessário)
CREATE POLICY "Enable read access for all users" ON public.meetings
    FOR SELECT USING (true);

-- Allow insert for authenticated users (webhook será autenticado com service role)
CREATE POLICY "Enable insert for authenticated users" ON public.meetings
    FOR INSERT WITH CHECK (true);

-- Allow update for authenticated users
CREATE POLICY "Enable update for authenticated users" ON public.meetings
    FOR UPDATE USING (true);

-- Allow delete for authenticated users
CREATE POLICY "Enable delete for authenticated users" ON public.meetings
    FOR DELETE USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_meetings_updated_at 
    BEFORE UPDATE ON public.meetings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
