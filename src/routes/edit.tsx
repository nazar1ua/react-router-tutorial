import {
   Form,
   useLoaderData,
   redirect,
   useNavigate,
} from 'react-router-dom'
import { ContactType, getContact, updateContact } from '../contacts'

export function loader({ params }: any) {
   return getContact(params.contactId)
}

export async function action({ request, params }: any) {
   const formData = await request.formData();
   const updates = Object.fromEntries(formData);
   await updateContact(params.contactId, updates);
   return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
   const contact: ContactType = (useLoaderData() as ContactType)
   const navigate = useNavigate()

   return (
      <Form method='post' id='contact-form'>
         <p>
            <span>Ім'я</span>
            <input
               placeholder="Ім'я"
               aria-label="Ім'я"
               type="text"
               name='first'
               defaultValue={contact.first}
            />
            <input
               placeholder='Прізвище'
               aria-label='Прізвище'
               type="text"
               name='last'
               defaultValue={contact.last}
            />
         </p>
         <label>
            <span>Twitter</span>
            <input
               type="text"
               name="twitter"
               placeholder="jack"
               defaultValue={contact.twitter}
            />
         </label>
         <label>
            <span>URL поличчя</span>
            <input
               placeholder="https://example.com/avatar.jpg"
               aria-label="URL поличчя"
               type="text"
               name="avatar"
               defaultValue={contact.avatar}
            />
         </label>
         <label>
            <span>Нотатки</span>
            <textarea
               name="notes"
               defaultValue={contact.notes}
               rows={6}
            />
         </label>
         <p>
            <button type="submit">Зберегти</button>
            <button
               type="button"
               onClick={() => {
                  navigate(-1)
               }}
            >Скасувати</button>
         </p>
      </Form>
   );
}
