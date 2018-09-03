import 'highlight.js/styles/docco.css'

export default (props) => (
  <div>
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
