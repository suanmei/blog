import Head from 'next/head';

export default (props) => (
  <div>
    <Head>
      <title>{ props.title }</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta charSet='utf-8' />
    </Head>

    <header>拾邑</header>

    <nav>导航</nav>

    <article>{ props.children }</article>

    <aside>热门文章</aside>

    <style jsx global>{`
      body {
        background: #eef;
      }
    `}</style>
  </div>
);