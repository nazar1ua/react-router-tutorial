import { Form, LoaderFunction, useLoaderData } from 'react-router-dom'
import { ContactType, getContact } from '../contacts'

export async function loader({ params }: any) {
   return getContact(params.contactId)
}

export default function Contact() {
   const contact: ContactType = (useLoaderData() as ContactType)

   return (
      <div id="contact">
         <div>
            <img
               key={contact.avatar}
               src={contact.avatar || undefined}
            />
         </div>

         <div>
            <h1>
               {contact.first || contact.last ? (
                  <>
                     {contact.first} {contact.last}
                  </>
               ) : (
                  <i>Немає імені</i>
               )}{" "}
               <Favorite contact={contact} />
            </h1>

            {contact.twitter && (
               <p>
                  <a
                     target="_blank"
                     href={`https://twitter.com/${contact.twitter}`}
                  >
                     {contact.twitter}
                  </a>
               </p>
            )}

            {contact.notes && <p>{contact.notes}</p>}

            <div>
               <Form action="edit">
                  <button type="submit">Редагувати</button>
               </Form>
               <Form
                  method="post"
                  action="destroy"
                  onSubmit={(event) => {
                     if (
                        !confirm(
                           "Будь ласка, підтвердьте, що Ви хочете видалити цей контакт."
                        )
                     ) {
                        event.preventDefault();
                     }
                  }}
               >
                  <button type="submit">Видалити</button>
               </Form>
            </div>
         </div>
      </div>
   );
}

function Favorite({ contact }: { contact: ContactType }) {
   // yes, this is a `let` for later
   let favorite = contact.favorite

   return (
     <Form method="post">
       <button
         name="favorite"
         value={favorite ? "false" : "true"}
         aria-label={
           favorite
             ? "Видалити з улюблених"
             : "Додати в улюблені"
         }
       >
         {favorite ? "★" : "☆"}
       </button>
     </Form>
   );
 }
