import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import LotteryEntrance from "../components/LotteryEntrance";
export default function Home() {
  return (
    <div>
      <Header />
      <LotteryEntrance />
    </div>
  );
}
