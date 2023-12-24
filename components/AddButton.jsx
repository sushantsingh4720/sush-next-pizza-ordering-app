import styles from "../styles/Add.module.css";

const AddButton = ({ setClose }) => {
  return (
    <div onClick={() => setClose(true)} className={styles.mainAddButton}>
      Add New Pizza
    </div>
  );
};

export default AddButton;
