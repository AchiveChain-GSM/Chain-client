import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import PostDetailView from '../components/postDetail/PostDetailView';

export default function PostDetail() {
  const location = useLocation();
  const initialPost = location.state?.post || null;

  return (
    <Layout>
      <main className="flex h-full flex-1">
        <section className="flex-1 pl-6">
          <PostDetailView initialPost={initialPost} />
        </section>
      </main>
    </Layout>
  );
}
