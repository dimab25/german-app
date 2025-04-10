import CreateFlashcard from '@/components/CreateFlashcard'
import DisplayFlashcard from '@/components/DisplayFlashcard'
import "@/styles/global.css";
import styles from "./page.module.css";
import DecksFlashcard from '@/components/DecksFlashcard';

function Flashcardspage() {
  return (
    <>
    <div className={styles.backgroundDiv}>
      <DecksFlashcard/>
    </div>
<div className={styles.backgroundDiv}>

    <DisplayFlashcard/></div>
    <CreateFlashcard/>
    </>
  )
}

export default Flashcardspage