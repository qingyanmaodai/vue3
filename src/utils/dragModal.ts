function dragModal() {
  const dialogHeaderEl = <HTMLImageElement>document.querySelector('.ant-modal-header');
  const dragDom = <HTMLImageElement>document.querySelector('.ant-modal');
  const styDom = <HTMLImageElement>document.querySelector('.ant-modal');
  const sty = styDom.style;
  dialogHeaderEl.style.cursor = 'move';
  dialogHeaderEl.onmousedown = (e) => {
    // 鼠标按下，计算当前元素距离可视区的距离
    const X = e.clientX; //鼠标位置
    const Y = e.clientY;
    const disX = e.clientX - e.offsetX; //拖拽的dom所在位置
    const disY = e.clientY - e.offsetY;
    //$(dragDom).css({ margin: '0px', left: disX, top: disY })
    dragDom.style.transform = 'translate(0px, 0px)';
    // 获取到的值带px 正则匹配替换
    let styL, styT, dragDomWidth, dragDomHeight;

    //注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
    if (sty.left.includes('%')) {
      styL = +document.body.clientWidth * (+sty.left.replace(/%/g, '') / 100);
      styT = +document.body.clientHeight * (+sty.top.replace(/%/g, '') / 100);
    } else {
      styL = +sty.left.replace(/px/g, '');
      styT = +sty.top.replace(/px/g, '');
      styT = styT === 0 ? 100 : styT;
      dragDomWidth = +sty.width.replace(/px/g, '');
      dragDomHeight = +sty.height.replace(/px/g, '');
    }
    document.onmousemove = function (e) {
      // 通过事件委托，计算移动的距离
      const l = e.clientX - X;
      const t = e.clientY - Y;
      console.log(l, t, styL, styT);
      // 移动当前元素
      dragDom.style.left = `${l + styL}px`;
      dragDom.style.top = `${t + styT}px`;
    };

    document.onmouseup = function (e) {
      document.onmousemove = null;
      document.onmouseup = null;
    };
    console.log('加载成功');
  };
}

export default dragModal;
//
// setTimeout(() => {
//   dragModal();
// }, 1000);
