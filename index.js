const { Project } = require("ts-morph");

const project = new Project();

const mockTransformType = () => {};

// 添加文件到 project 这个对象中去
project.addSourceFilesAtPaths("__test__/*.tsx");
// 源文件
const sourceFile = project.getSourceFileOrThrow("index.tsx");
// 获取 export 声明的语句
const exportAssignments = sourceFile.getExportAssignments();
if (!exportAssignments.length) {
  // 表明不是用声明式写的组件 那就是 直接 export default Component 的这种形式
  const defaultclass = sourceFile.getClasses().find((i) => i.isDefaultExport());
  const propsType = defaultclass.getExtends().getTypeArguments()[0].getType();
  // 解析类型
  mockTransformType(propsType);
} else {
  // 获取到 export default 的那条声明语句
  const defaultExport = exportAssignments.find((i) => !i.isExportEquals());
  // 先通过获取 表达式 再取类型，这里拿到的类型是整个组件的类型 而不是 props 的类型
  const type = defaultExport.getExpression().getType();
  // 判断是否为 class 组件
  const isClass = type.isClass();
  if (isClass) {
    // 获取 class 组件的名称
    const className = defaultExport.getExpression().getText();
    // 通过名称获取目标 class
    const targetClass = sourceFile.getClass(className);
    // 获取继承的类型的参数
    // 通常 React.Component 和 React.PureComponent 的 props 在前 state 在后
    // 所以这里拿数组的第一个元素
    const propsType = targetClass.getExtends().getTypeArguments()[0].getType();

    // 解析类型
    mockTransformType(propsType);
    // 完成
  } else {
    // 获取函数的签名，由于 js 语言的特殊性，所以此处的签名应该只有一个
    const callsignatures = type.getCallSignatures()[0];
    // 获取到参数的声明的类型,
    // 可能存在多个的情况 所以 propsType 是数组
    const propsType = callsignatures
      .getParameters()
      .map((p) => p.getValueDeclaration().getType());

    propsType.forEach((pType) => {
      // 解析类型
      return mockTransformType(pType);
    });
    // 完成
  }
}

console.log("success");
