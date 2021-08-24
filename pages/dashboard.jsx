export default function AdminDashboard() {
  return 'Some super secret dashboard content here';
}

AdminDashboard.auth = {
  loading: <p>Loading...</p>,
  unauthorized: '/',
};
