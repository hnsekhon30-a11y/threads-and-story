DROP POLICY "Published products are viewable by everyone" ON public.products;
CREATE POLICY "Published products are public" ON public.products FOR SELECT TO anon USING (is_published);
CREATE POLICY "Signed in users view products" ON public.products FOR SELECT TO authenticated USING (is_published OR public.has_role(auth.uid(), 'admin'));