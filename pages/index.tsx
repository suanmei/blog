import React from 'react';
import Marked from 'marked';
import Highlight from 'highlight.js';
import Layout from '../component/layout/index';

import Http from '../utils/http';

export default class appid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      md: '',
    };
  }

  async aa() {
    const aaa = await Http.get('/api/users/suanmei/followers');
    return aaa;
  }

  async markdown() {
    const md = await Http.get('/markdown');
    this.setState({
      md,
    });
  }

  public componentDidMount() {
    this.markdown()
  }

  render() {
    Marked.setOptions({
      gfm: true,
      highlight: (code) => {
        return Highlight.highlightAuto(code).value;
      },
      langPrefix: 'hljs lang-',
    });
    const md = this.state.md.data ? this.state.md.data.md : '' ;
    const html = Marked(md);
    return (
      <Layout title={ '拾邑' }>
        <section>
          <h1>博客文章</h1>
          <i className={ 'icon' }></i>
          <div dangerouslySetInnerHTML={{__html: html}}></div>
        </section>
      </Layout>
    );
  }
}
