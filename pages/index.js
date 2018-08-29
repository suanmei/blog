import React from 'react';
import Layout from '../component/layout';

import Http from '../utils/http';

export default class appid extends React.Component {
  async aa() {
    debugger;
    const aaa = await Http.get('/api/users/suanmei/followers');
    return aaa;
  }

  render() {
    this.aa();
    return (
      <Layout title={ '拾邑' }>
        <section>
          <h1>博客文章</h1>
          <i className={ 'icon' }></i>
        </section>
      </Layout>
    );
  }
}
