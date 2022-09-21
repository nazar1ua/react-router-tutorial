import { useRouteError } from 'react-router-dom'

interface ErrorResponse {
   data: any | null
   status: number
   statusText: string
   message: string
}

export default function ErrorPage() {
   const error = (useRouteError() as ErrorResponse)
   console.error(error)

   return (
      <div id="error-page">
         <h1>Упс...</h1>
         <p>Вибачте, з'явилась невідома помилка</p>
         <p>
            <i>{error.statusText || error.message}</i>
         </p>
      </div>
   );
}
