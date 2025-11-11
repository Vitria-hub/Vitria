-- Permitir que usuarios autenticados lean su propio registro
CREATE POLICY "Users can read their own data"
  ON public.users FOR SELECT
  USING (auth_id = auth.uid());

-- Permitir que usuarios autenticados actualicen su propio registro  
CREATE POLICY "Users can update their own data"
  ON public.users FOR UPDATE
  USING (auth_id = auth.uid());

-- Permitir insertar nuevo registro de usuario al registrarse
CREATE POLICY "Users can insert their own data"
  ON public.users FOR INSERT
  WITH CHECK (auth_id = auth.uid());
