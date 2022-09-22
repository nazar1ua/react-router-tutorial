import {
   useLoaderData,
   Form,
   useFetcher,
} from 'react-router-dom'
import { ContactType, getContact, updateContact } from '../contacts'

export async function loader({ params }: any) {
   const contact = await getContact(params.contactId)
   if (!contact) {
      throw new Response('', {
         status: 404,
         statusText: 'Not Found',
      })
   }
   return contact
}

export async function action({ request, params }: any) {
   let formData = await request.formData()
   return updateContact(params.contactId, {
      favorite: formData.get('favorite') === 'true',
   })
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
   const fetcher = useFetcher()

   let favorite = contact.favorite
   if (fetcher.formData) {
      favorite = fetcher.formData.get("favorite") === 'true'
   }


   return (
      <fetcher.Form method="post">
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
      </fetcher.Form>
   );
}
