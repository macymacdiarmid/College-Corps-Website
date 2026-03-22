-- Applicants can read their own application (email must match their auth email)
create policy "allow applicant read own application"
  on applications for select to authenticated
  using (email = auth.email());
