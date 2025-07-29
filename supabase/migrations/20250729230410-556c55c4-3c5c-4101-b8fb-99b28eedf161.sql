-- Add missing columns to productions table
ALTER TABLE public.productions 
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS description text;

-- Create some sample productions data without specific user IDs
-- This will be populated with real user data when users start using the app
INSERT INTO public.productions (
  name, description, status, protein_type, frozen_weight, thawed_weight, 
  clean_weight, final_weight, tray_count, visual_analysis, 
  initial_cleaning, final_cleaning, epi_used, batch_code,
  production_date, dehydrator_temperature, ambient_temperature,
  user_id
) 
SELECT 
  'Filé de Frango Desidratado' as name,
  '2 produções seguidas - 3 bandejas de teste de frango para treino - 1020g limpos' as description,
  'finished' as status,
  'Frango' as protein_type,
  13490 as frozen_weight,
  11324 as thawed_weight,
  10342 as clean_weight,
  2624 as final_weight,
  19 as tray_count,
  true as visual_analysis,
  true as initial_cleaning,
  true as final_cleaning,
  true as epi_used,
  'DEMO-7986' as batch_code,
  '2025-03-31' as production_date,
  70 as dehydrator_temperature,
  24 as ambient_temperature,
  id as user_id
FROM profiles 
LIMIT 1
WHERE id = (SELECT id FROM profiles LIMIT 1);

-- Only insert if we have at least one user profile
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM profiles LIMIT 1) THEN
    -- Insert additional sample data for existing users
    INSERT INTO public.productions (
      name, description, status, protein_type, frozen_weight, thawed_weight, 
      clean_weight, final_weight, tray_count, visual_analysis, 
      initial_cleaning, final_cleaning, epi_used, batch_code,
      production_date, dehydrator_temperature, user_id
    ) 
    SELECT 
      cases.name,
      cases.description,
      cases.status,
      cases.protein_type,
      cases.frozen_weight,
      cases.thawed_weight,
      cases.clean_weight,
      cases.final_weight,
      cases.tray_count,
      cases.visual_analysis,
      cases.initial_cleaning,
      cases.final_cleaning,
      cases.epi_used,
      cases.batch_code,
      cases.production_date,
      cases.dehydrator_temperature,
      profiles.user_id
    FROM (
      VALUES 
        ('Manjuba', '46h', 'finished', 'Manjuba', 13500, 0, 13000, 1534, 9, true, true, true, true, 'DEMO-7989', '2025-04-09', 70),
        ('Filé Mignon Suíno', NULL, 'finished', 'Filé Mignon Suíno', 2680, 2622, 2452, 616, 6, true, true, true, true, 'DEMO-7990', '2025-04-10', 70),
        ('Fígado Fgo', NULL, 'finished', 'Fígado de frango', 7000, 6914, 6592, 1504, 9, true, true, true, true, 'DEMO-7991', '2025-04-10', 70),
        ('Bucho bovino', NULL, 'finished', 'Bucho Bovino', 0, 6600, 6040, 1238, 6, true, true, true, true, 'DEMO-7992', '2025-04-15', 70)
    ) AS cases(name, description, status, protein_type, frozen_weight, thawed_weight, clean_weight, final_weight, tray_count, visual_analysis, initial_cleaning, final_cleaning, epi_used, batch_code, production_date, dehydrator_temperature)
    CROSS JOIN profiles
    LIMIT 4;
  END IF;
END $$;