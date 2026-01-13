-- Create table to store pending form data from API
CREATE TABLE public.fic_form_pending_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vin TEXT NOT NULL,
  form_type TEXT NOT NULL CHECK (form_type IN ('trunk_tailgate', 'back_form')),
  section TEXT,
  data JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create index for quick lookup of unprocessed data
CREATE INDEX idx_fic_form_pending_vin_processed ON public.fic_form_pending_data(vin, processed, form_type);

-- Enable Row Level Security
ALTER TABLE public.fic_form_pending_data ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write for form data (since this is an inspection app without user auth)
CREATE POLICY "Allow public read access" 
ON public.fic_form_pending_data 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access" 
ON public.fic_form_pending_data 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access" 
ON public.fic_form_pending_data 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access" 
ON public.fic_form_pending_data 
FOR DELETE 
USING (true);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.fic_form_pending_data;