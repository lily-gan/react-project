const {override,fixBabelImports,addLessLoader,addBabelPlugins} = require('customize-cra')
module.exports = override(
  //让antd按需加载
  fixBabelImports('import',{
    libraryName:'antd',
    libraryDirectory:'es',
    style:true,
  }),
  //自定义主题
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA57A' },
  }),
  // 编译装饰器语法
  addBabelPlugins(
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ]
  )
);