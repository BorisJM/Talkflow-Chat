import NotFoundPage from "./NotFoundPage"

function NotAuthorizedPage(){
return <NotFoundPage code={401} text={'To visit that page , you need to be logged in.'}/>
}

export default NotAuthorizedPage