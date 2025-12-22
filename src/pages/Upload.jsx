import Layout from '../components/Layout';
import WriteEditor from '../components/upload/writeEditor';

export default function UploadPage() {
  return (
    <Layout>
      <main className="flex h-full flex-1">
        <section className="flex-1 pl-6">
          <WriteEditor />
        </section>
      </main>
    </Layout>
  );
}