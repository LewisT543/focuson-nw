import { DataD } from "../common/dataD";
import { CommonRestOnCommit, isRestOnCommitRefresh, MainPageD, ModalPageD, PageD, RestOnCommit } from "../common/pageD";
import { CopyStringDetails, PageOps, PageParams, SetToLengthOnClose } from "@focuson-nw/pages";
import { ButtonCreator, MakeButton, makeIdForButton } from "../codegen/makeButtons";
import { indentList, opt, optObj, optT } from "../codegen/codegen";
import { emptyName, modalName, restDetailsName } from "../codegen/names";
import { EnabledBy, enabledByString } from "./enabledBy";
import { CopyDetails, decamelize, PageMode, toArray, toArrayOrUndefined } from "@focuson-nw/utils";
import { ModalChangeCommands, RestCommand, RestLoadWindowWithoutRestProps, } from "@focuson-nw/rest";
import { stateQueryForParams } from "../codegen/lens";


function restCommandForButton<B, G> ( mainPage: MainPageD<B, G>, parent: PageD<B, G>, rest?: CommonRestOnCommit ): RestCommand {
  const rd = mainPage.rest[ rest.restName ]
  if ( !rd ) throw new Error ( `Illegal rest name ${rest.restName} on page ${parent.name}. Legal values are ${Object.keys ( mainPage.rest )}` )
  const deleteOnSuccess = isRestOnCommitRefresh ( rest ) ? { deleteOnSuccess: rest.pathToDelete } : {}
  const { action, restName, messageOnSuccess } = rest
  let restCommand: RestCommand = {
    name: restDetailsName ( mainPage, restName, rd.rest ),
    restAction: action, messageOnSuccess, ...deleteOnSuccess, on404: toArrayOrUndefined ( rest.on404 ), changeOnSuccess: toArrayOrUndefined ( rest.changeOnSuccess ) , changeOnCompletion: toArrayOrUndefined(rest.changeOnComplete)
  };
  return restCommand
}
export function restForButton<B, G> ( mainPage: MainPageD<B, G>, parent: PageD<B, G>, rest?: RestOnCommit ): string[] {
  if ( !rest ) return []
  const restCommand = restCommandForButton ( mainPage, parent, rest )
  return [ ` rest={${JSON.stringify ( restCommand )}}` ]
}

export function isModalButtonInPage<G> ( m: any ): m is ModalOrMainButtonInPage<G> {
  return m.control === 'ModalButton'
}

export interface CommonModalButtonInPage<G> extends EnabledBy {
  text?: string;
  mode: PageMode,
  pageParams?: PageParams,
  restOnCommit?: RestOnCommit,
  loader?: RestLoadWindowWithoutRestProps
  copy?: CopyDetails | CopyDetails[],
  copyOnClose?: CopyDetails | CopyDetails[];
  change?: ModalChangeCommands | ModalChangeCommands[];
  changeOnClose?: ModalChangeCommands | ModalChangeCommands[];
  // changeOnRestSuccessful?: ModalChangeCommands | ModalChangeCommands[];
  changeOnRest404?: ModalChangeCommands | ModalChangeCommands[];
  restOnOpen?: CommonRestOnCommit | CommonRestOnCommit[]
  copyJustString?: CopyStringDetails | CopyStringDetails[],
  setToLengthOnClose?: SetToLengthOnClose;
  pageOp?: PageOps;
  deleteOnOpen?: string | string[];
  control: 'ModalButton',
  createEmpty?: DataD<G>;
  createEmptyIfUndefined?: DataD<G>;
}
export interface ModalPageButtonInPage<G> extends CommonModalButtonInPage<G> {
  modal: ModalPageD<any, G>,
  focusOn: string,
}
export function isModal<G> ( m: ModalOrMainButtonInPage<G> ): m is ModalPageButtonInPage<G> {
  const a: any = m
  return a.modal
}
export interface MainPageButtonInPage<G> extends CommonModalButtonInPage<G> {
  main: MainPageD<any, G>,
}
export type ModalOrMainButtonInPage<G> = ModalPageButtonInPage<G> | MainPageButtonInPage<G>

function singleToList<T> ( ts: T | T[] ): T[] {
  if ( Array.isArray ( ts ) ) return ts
  return [ ts ]
}
function makeModalButtonInPage<G> (): ButtonCreator<ModalOrMainButtonInPage<G>, G> {
  return {
    import: "@focuson-nw/pages",
    makeButton:
      ( { params, mainPage, parent, name, button } ) => {
        const {
                mode, restOnCommit, loader, copy, createEmpty, createEmptyIfUndefined, copyOnClose, copyJustString, setToLengthOnClose,
                text, pageParams, buttonType, deleteOnOpen, change, changeOnClose, restOnOpen, pageOp
              } = button
        const createEmptyString = createEmpty ? [ `createEmpty={${params.emptyFile}.${emptyName ( createEmpty )}}` ] : []
        const createEmptyIfUndefinedString = createEmptyIfUndefined ? [ `createEmptyIfUndefined={${params.emptyFile}.${emptyName ( createEmptyIfUndefined )}}` ] : []
        createEmptyIfUndefined

        const copyOnCloseArray: CopyDetails[] | undefined = copyOnClose ? toArray ( copyOnClose ) : undefined
        const copyFromArray: CopyDetails[] | undefined = copy ? toArray ( copy ) : undefined
        const pageLink = isModal ( button ) ? `modal='${modalName ( mainPage, button.modal )}'` : `main='${button.main.name}'`
        const focusOn = isModal ( button ) ? button.focusOn : undefined
        const focusOnLensForCompileCheck = focusOn ? stateQueryForParams ( `Modal button Page ${parent.name} / ${name}`, params, mainPage, parent, focusOn ) : undefined
        const restsOnOpen = restOnOpen ? toArray ( restOnOpen ).map ( r => restCommandForButton ( mainPage, parent, r ) ) : undefined
        return [ `<${button.control} id=${makeIdForButton ( name )} ${enabledByString ( button )}text='${text ? text : decamelize ( name, ' ' )}' dateFn={defaultDateFn} state={state} ${pageLink} `,
          ...indentList ( [
            ...opt ( 'pageMode', mode ),
            ...optT ( 'focusOn', focusOn ),
            ...focusOn ? [ `// If there is a compile error here the focuson path might not exist` ] : [],
            ...optObj ( 'focusOnLensForCompileCheck', focusOnLensForCompileCheck ),
            ...optT ( 'loader', loader ),
            ...optT ( 'buttonType', buttonType ),
            ...optT ( 'copy', copyFromArray ),
            ...optT ( 'copyOnClose', copyOnCloseArray ),
            ...optT ( 'restOnOpen', restsOnOpen ),
            ...optT ( 'copyJustString', copyJustString ? singleToList ( copyJustString ) : undefined ),
            ...optT ( 'pageParams', pageParams ),
            ...optT ( 'deleteOnOpen', deleteOnOpen ? toArray ( deleteOnOpen ) : undefined ),
            ...optT ( 'change', change ),
            ...optT ( 'pageOp', pageOp ),
            ...optT ( 'changeOnClose', changeOnClose ),
            ...createEmptyString,
            ...createEmptyIfUndefinedString,
            ...optT ( 'setToLengthOnClose', setToLengthOnClose ),
            ...restForButton ( mainPage, parent, restOnCommit ) ] ), '/>' ]

      }
  }
}

export function makeModalButtons<G> (): MakeButton<G> {
  return { ModalButton: makeModalButtonInPage<G> (), }
}




