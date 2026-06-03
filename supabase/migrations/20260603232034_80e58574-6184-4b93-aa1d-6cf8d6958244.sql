
-- Explicitly deny anon & authenticated access to the private 'books' bucket.
-- Service role bypasses RLS and remains able to mint signed URLs via download-book.
CREATE POLICY "books bucket: no anon/authenticated select"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'books' AND false);

CREATE POLICY "books bucket: no anon/authenticated insert"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'books' AND false);

CREATE POLICY "books bucket: no anon/authenticated update"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'books' AND false)
  WITH CHECK (false);

CREATE POLICY "books bucket: no anon/authenticated delete"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'books' AND false);
