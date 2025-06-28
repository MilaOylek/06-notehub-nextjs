import axios from "axios";
import {
  Formik,
  Field,
  Form,
  ErrorMessage as FormikErrorMessage,
} from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {createNote} from "@/lib/api";
import {type CreateNotePayload, type Tag } from "../../types/note";
import styles from "./NoteForm.module.css";

interface NoteFormProps {
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

function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
      console.log("Note created successfully!");
    },
    onError: (err) => {
      console.error("Failed to create note:", err);

      if (axios.isAxiosError(err) && err.response?.data?.validation) {
        console.error("API Validation details:", err.response.data.validation);
      }
    },
  });

  const handleSubmit = async (values: {
    title: string;
    content: string;
    tag: Tag;
  }) => {
    const payload: CreateNotePayload = {
      title: values.title,
      content: values.content,
      tag: values.tag,
    };
    createNoteMutation.mutate(payload);
  };

  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Todo" }}
      validationSchema={noteSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <h3>Створити нову нотатку</h3>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              type="text"
              name="title"
              className={styles.input}
              disabled={isSubmitting || createNoteMutation.isPending}
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
              rows="8"
              className={styles.textarea}
              disabled={isSubmitting || createNoteMutation.isPending}
            />
            <FormikErrorMessage
              name="content"
              component="span"
              className={styles.error}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={styles.select}
                   disabled={isSubmitting || createNoteMutation.isPending}
            >
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

          {createNoteMutation.isError && (
            <p className={styles.error}>
              Failed to create note: {createNoteMutation.error.message}
            </p>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting || createNoteMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || createNoteMutation.isPending}
            >
              {createNoteMutation.isPending ? "Creating..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default NoteForm;