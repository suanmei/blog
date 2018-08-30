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
        margin: 0;
        padding: 0;
        background: #eef;
      }

      header {
        padding-left: 100px;
        height: 80px;
        line-height: 80px;
        background: rgba(255, 255, 255, .5);
      }

      nav {
        position: fixed;
        top: 100px;
        left: 30px;
        width: 100px;
        height: 200px;
        background: #ffffff;
      }

      article {
        margin-top: 20px;
        margin-left: 200px;
        width: 600px;
        background: #ffffff;
      }

      aside {
        margin-top: 20px;
        margin-right: 50px;
        float: right;
        width: 100px;
        height: 100px;
        background: #ffffff;
      }
    `}</style>
  </div>
);
