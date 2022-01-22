import { ActionFunction, redirect } from "remix";
import {logout} from '~/utils/session.server'

export let action: ActionFunction = async ({request}) => {
  return logout(request);
}

export let loader = async () => {
  return redirect('/');
}
