import { useEffect } from 'react'
import {
   Outlet,
   NavLink,
   useLoaderData,
   Form,
   redirect,
   useNavigation,
   useSubmit,
} from 'react-router-dom'
import { ContactType, getContacts, createContact } from '../contacts'

export async function action() {
   const contact: ContactType = await createContact()
   return redirect(`/contacts/${contact.id}/edit`)
}

export async function loader({ request }: any) {
   const url: URL = new URL(request.url)
   const q: string | null = url.searchParams.get('q')
   const contacts: ContactType[] = await getContacts(q)
   return { contacts, q }
}

export default function Root() {
   const { contacts, q }: { contacts: ContactType[], q: string } = (useLoaderData() as { contacts: ContactType[], q: string })
   const navigation = useNavigation()
   const submit = useSubmit()

   const searching =
      navigation.location &&
      new URLSearchParams(navigation.location.search).has('q')

   useEffect(() => {
      (document.getElementById('q') as HTMLInputElement).value = q
   }, [q])

   return (
      <>
         <div id="sidebar">
            <h1>Контакти</h1>
            <div>
               <Form id="search-form" role="search">
                  <input
                     id="q"
                     className={searching ? 'loading' : ''}
                     aria-label="Пошук контактів"
                     placeholder="Пошук..."
                     type="search"
                     name="q"
                     defaultValue={q}
                     onChange={event => {
                        const ifFirstSearch = q == null
                        submit(event.currentTarget.form, {
                           replace: !ifFirstSearch
                        })
                     }}
                  />
                  <div
                     id="search-spinner"
                     aria-hidden
                     hidden={!searching}
                  />
                  <div
                     className="sr-only"
                     aria-live="polite"
                  ></div>
               </Form>
               <Form method="post">
                  <button type="submit">Створити</button>
               </Form>
            </div>
            <nav>
               {contacts.length ? (
                  <ul>
                     {contacts.map((contact: ContactType) => (
                        <li key={contact.id}>
                           <NavLink
                              to={`contacts/${contact.id}`}
                              className={({ isActive, isPending }) =>
                                 isActive
                                    ? 'active'
                                    : isPending
                                       ? 'pending'
                                       : ''
                              }
                           >
                              {contact.first || contact.last ? (
                                 <>
                                    {contact.first} {contact.last}
                                 </>
                              ) : (
                                 <i>Немає імені</i>
                              )}{" "}
                              {contact.favorite && <span>★</span>}
                           </NavLink>
                        </li>
                     ))}
                  </ul>
               ) : (
                  <p>
                     <i>Немає контактів</i>
                  </p>
               )}
            </nav>
         </div>
         <div
            id="detail"
            className={navigation.state === 'loading' ? 'loading' : ''}
         >
            <Outlet />
         </div>
      </>
   );
}