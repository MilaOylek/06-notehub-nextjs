import {
  Formik,
  Field,
  Form,
  ErrorMessage as FormikErrorMessage,
} from "formik";
import * as Yup from "yup";
import { type Tag } from "@/types/note";
// import { type CreateNotePayload, type Tag } from "@/types/note";

import styles from "./NoteForm.module.css";

interface NoteFormProps {
  onCreateNote: (title: string, content: string, tag?: Tag) => void;
  isCreating?: boolean;
  onClose: () => void;
}

const noteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.string<Tag>()
    .oneOf(
      ["Todo", "Work", "Personal", "Meeting", "Shopping"],
      "Invalid tag selected"
    )
    .required("Tag is required"),
});

function NoteForm({ onCreateNote, isCreating = false, onClose }: NoteFormProps) {
  const handleSubmit = async (values: {
    title: string;
    content: string;
    tag: Tag;
  }) => {
    onCreateNote(values.title, values.content, values.tag);
  };

  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Todo" }}
      validationSchema={noteSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              type="text"
              name="title"
              className={styles.input}
            />
            <FormikErrorMessage
              name="title"
              component="span"
              className={styles.error}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={styles.textarea}
            />
            <FormikErrorMessage
              name="content"
              component="span"
              className={styles.error}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={styles.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <FormikErrorMessage
              name="tag"
              component="span"
              className={styles.error}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting || isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || isCreating}
            >
              {isCreating ? "Creating..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default NoteForm;
