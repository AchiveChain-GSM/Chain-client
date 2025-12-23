import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import WriteEditor from '../components/upload/writeEditor';

export default function UploadPage() {
  const location = useLocation();
  const initialPost = location.state?.post || null;

  return (
    <Layout>
      <main className="flex h-full flex-1">
        <section className="flex-1 pl-6">
          <WriteEditor initialPost={initialPost} />
        </section>
      </main>
    </Layout>
  );
}
