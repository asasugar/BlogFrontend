import React from "react";
import style from "./About.scss";
import qrcode from "../../assets/qrcode.jpg";
class About extends React.Component {
  state = {};
  componentDidMount() {}
  componentWillUnmount() {}
  render() {
    return (
      <div className={style.about}>
        <img src={qrcode} alt="如同鸡讲" />
        <p className={style.tips}>快来骚我啊~</p>
      </div>
    );
  }
}

export default About;
