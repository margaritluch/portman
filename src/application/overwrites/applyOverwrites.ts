import { PostmanMappedOperation } from 'src/postman'
import { OasMappedOperation, OpenApiParser } from 'src/oas'
import {
  GlobalConfig,
  OverwritePathVariableConfig,
  OverwriteQueryParamConfig,
  OverwriteRequestBodyConfig,
  OverwriteRequestConfig,
  OverwriteRequestHeadersConfig
} from 'src/types'
import {
  overwriteRequestBody,
  overwriteRequestHeaders,
  overwriteRequestPathVariables,
  overwriteRequestQueryParams,
  overwriteRequestBaseUrl,
  overwriteRequestSecurity
} from '.'

export interface OverwriteRequestDTO {
  overwriteValues?:
    | OverwriteQueryParamConfig[]
    | OverwriteRequestHeadersConfig[]
    | OverwritePathVariableConfig[]
    | OverwriteRequestBodyConfig[]
  pmOperation: PostmanMappedOperation
  oaOperation?: OasMappedOperation | null
  globals?: GlobalConfig
}

export const applyOverwrites = (
  pmOperations: PostmanMappedOperation[],
  overwriteSetting: OverwriteRequestConfig,
  oasParser: OpenApiParser,
  settings?: GlobalConfig
): PostmanMappedOperation[] => {
  return pmOperations.map(pmOperation => {
    // Get OpenApi operation
    const oaOperation = oasParser.getOperationByPath(pmOperation.pathRef) as OasMappedOperation

    // overwrite request body
    const overwriteRequestBodyDto = {
      overwriteValues: overwriteSetting?.overwriteRequestBody || [],
      pmOperation,
      oaOperation,
      settings
    }
    overwriteSetting?.overwriteRequestBody && overwriteRequestBody(overwriteRequestBodyDto)

    // overwrite request query params
    const overwriteRequestQueryParamsDto = {
      overwriteValues: overwriteSetting?.overwriteRequestQueryParams || [],
      pmOperation,
      oaOperation,
      settings
    }
    overwriteSetting?.overwriteRequestQueryParams &&
      overwriteRequestQueryParams(overwriteRequestQueryParamsDto)

    // overwrite request path id variables
    // const overwriteRequestPathIdDto = {
    //   overwriteValues: overwriteSetting.overwriteRequestPathIdVariables || [],
    //   pmOperation,
    //   oaOperation,
    //   settings
    // }
    // overwriteSetting?.overwriteRequestPathIdVariables &&
    //   overwriteRequestPathIdVariables(overwriteRequestPathIdDto)

    // overwrite request path variables
    const overwriteRequestPathVariablesDto = {
      overwriteValues: overwriteSetting?.overwriteRequestPathVariables || [],
      pmOperation,
      oaOperation,
      settings
    }
    overwriteSetting?.overwriteRequestPathVariables &&
      overwriteRequestPathVariables(overwriteRequestPathVariablesDto)

    // overwrite request headers
    const overwriteRequestHeadersDto = {
      overwriteValues: overwriteSetting?.overwriteRequestHeaders || [],
      pmOperation,
      oaOperation,
      settings
    }
    overwriteSetting?.overwriteRequestHeaders && overwriteRequestHeaders(overwriteRequestHeadersDto)

    // overwrite request base url
    overwriteSetting?.overwriteRequestBaseUrl &&
      overwriteRequestBaseUrl(overwriteSetting.overwriteRequestBaseUrl, pmOperation)

    overwriteSetting?.overwriteRequestSecurity &&
      overwriteRequestSecurity(overwriteSetting.overwriteRequestSecurity, pmOperation)

    return pmOperation
  })
}
