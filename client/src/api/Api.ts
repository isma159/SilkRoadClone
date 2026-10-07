/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum Roles {
  Admin = "Admin",
  User = "User",
}

export interface CategoryDto {
  categoryId?: string;
  categoryName?: string;
  description?: string | null;
}

export interface CreateCategoryRequestDto {
  categoryName?: string;
  description?: string | null;
}

export interface UpdateCategoryRequestDto {
  /** @minLength 1 */
  categoryIdForLookup?: string;
  newName?: string | null;
  newDescription?: string | null;
}

export interface ImageUploadResponse {
  url?: string;
}

export interface OrderDto {
  id?: string;
  buyerId?: string;
  vendorId?: string;
  productId?: string;
  /** @format int32 */
  quantity?: number;
  /** @format decimal */
  pricePaidDkk?: number;
  status?: string;
  /** @format date-time */
  createdAtUtc?: string;
}

export interface CreateOrderRequestDto {
  buyerId?: string;
  productId?: string;
  /** @format int32 */
  quantity?: number;
}

export interface UpdateOrderStatusRequestDto {
  orderId?: string;
  status?: string;
}

export interface VendorStatsDto {
  vendorId?: string;
  vendorName?: string;
  /** @format int32 */
  completedOrderCount?: number;
  /** @format int32 */
  rank?: number;
}

export interface ProductResponse {
  id?: string;
  title?: string;
  description?: string | null;
  /** @format decimal */
  priceDkk?: number;
  /** @format int32 */
  stock?: number;
  shipsFrom?: string | null;
  imageUrl?: string | null;
  categoryId?: string;
  vendorId?: string;
  isActive?: boolean;
  /** @format date-time */
  createdAtUtc?: string;
  vendor?: User | null;
}

export interface User {
  id?: string;
  username?: string;
  password?: string;
  products?: Product[];
  role?: Roles;
}

export interface Product {
  id?: string;
  title?: string;
  description?: string | null;
  /** @format decimal */
  priceDkk?: number;
  /** @format int32 */
  stock?: number;
  shipsFrom?: string | null;
  imageUrl?: string | null;
  categoryId?: string;
  vendorId?: string;
  isActive?: boolean;
  /** @format date-time */
  createdAtUtc?: string;
  vendor?: User | null;
}

export interface ProductCreateRequest {
  title?: string;
  description?: string | null;
  /** @format decimal */
  priceDkk?: number;
  /** @format int32 */
  stock?: number;
  shipsFrom?: string | null;
  imageUrl?: string | null;
  categoryId?: string;
  vendorId?: string;
}

export interface ProductUpdateRequest {
  id?: string;
  title?: string | null;
  description?: string | null;
  /** @format decimal */
  priceDkk?: number | null;
  /** @format int32 */
  stock?: number | null;
  shipsFrom?: string | null;
  imageUrl?: string | null;
  categoryId?: string | null;
}

export interface UserDto {
  id?: string;
  username?: string;
  products?: Product[];
  role?: Roles;
}

export interface LoginDto {
  username?: string;
  password?: string;
}

export interface CreateUserRequestDto {
  username?: string;
  password?: string;
}

export interface CategoryDeleteCategoryParams {
  categoryId?: string;
}

export interface OrderGetVendorsAboveThresholdParams {
  /** @format int32 */
  threshold?: number;
  /** @format int32 */
  limit?: number | null;
}

export interface ProductGetAllParams {
  categoryId?: string | null;
  search?: string | null;
}

export interface ProductGetByIdParams {
  id?: string;
}

export interface ProductDeleteParams {
  id?: string;
}

export interface ProductSearchProductsParams {
  CategoryId?: string | null;
  /** @format decimal */
  MinPriceDkk?: number | null;
  /** @format decimal */
  MaxPriceDkk?: number | null;
  Keyword?: string | null;
}

export interface UserGetUserByNameParams {
  name: string;
}

export interface UserGetUserByIdParams {
  id: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:5285";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data.data;
    });
  };
}

/**
 * @title My Title
 * @version 1.0.0
 * @baseUrl http://localhost:5285
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  category = {
    /**
     * No description
     *
     * @tags Category
     * @name CategoryGetCategories
     * @request GET:/Category/GetCategories
     */
    categoryGetCategories: (params: RequestParams = {}) =>
      this.request<CategoryDto[], any>({
        path: `/Category/GetCategories`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Category
     * @name CategoryCreateCategory
     * @request POST:/Category/CreateCategory
     */
    categoryCreateCategory: (
      data: CreateCategoryRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<CategoryDto, any>({
        path: `/Category/CreateCategory`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Category
     * @name CategoryUpdateCategory
     * @request PUT:/Category/UpdateCategory
     */
    categoryUpdateCategory: (
      data: UpdateCategoryRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/Category/UpdateCategory`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Category
     * @name CategoryDeleteCategory
     * @request DELETE:/Category/DeleteCategory
     */
    categoryDeleteCategory: (
      query: CategoryDeleteCategoryParams = {},
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/Category/DeleteCategory`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  image = {
    /**
     * No description
     *
     * @tags Image
     * @name ImageUpload
     * @request POST:/Image/Upload
     */
    imageUpload: (
      data: {
        /** @format binary */
        file?: File | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<ImageUploadResponse, any>({
        path: `/Image/Upload`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  order = {
    /**
     * No description
     *
     * @tags Order
     * @name OrderGetAll
     * @request GET:/Order/GetAll
     */
    orderGetAll: (params: RequestParams = {}) =>
      this.request<OrderDto[], any>({
        path: `/Order/GetAll`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderCreate
     * @request POST:/Order/Create
     */
    orderCreate: (data: CreateOrderRequestDto, params: RequestParams = {}) =>
      this.request<OrderDto, any>({
        path: `/Order/Create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderUpdateStatus
     * @request PATCH:/Order/UpdateStatus
     */
    orderUpdateStatus: (
      data: UpdateOrderStatusRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<OrderDto, any>({
        path: `/Order/UpdateStatus`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderGetVendorsAboveThreshold
     * @request GET:/Order/GetVendorsAboveThreshold
     */
    orderGetVendorsAboveThreshold: (
      query: OrderGetVendorsAboveThresholdParams = {},
      params: RequestParams = {},
    ) =>
      this.request<VendorStatsDto[], any>({
        path: `/Order/GetVendorsAboveThreshold`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  product = {
    /**
     * No description
     *
     * @tags Product
     * @name ProductGetAll
     * @request GET:/Product/GetAll
     */
    productGetAll: (
      query: ProductGetAllParams = {},
      params: RequestParams = {},
    ) =>
      this.request<ProductResponse[], any>({
        path: `/Product/GetAll`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Product
     * @name ProductGetById
     * @request GET:/Product/GetById
     */
    productGetById: (
      query: ProductGetByIdParams = {},
      params: RequestParams = {},
    ) =>
      this.request<ProductResponse, any>({
        path: `/Product/GetById`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Product
     * @name ProductCreate
     * @request POST:/Product/Create
     */
    productCreate: (data: ProductCreateRequest, params: RequestParams = {}) =>
      this.request<ProductResponse, any>({
        path: `/Product/Create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Product
     * @name ProductUpdate
     * @request PATCH:/Product/Update
     */
    productUpdate: (data: ProductUpdateRequest, params: RequestParams = {}) =>
      this.request<ProductResponse, any>({
        path: `/Product/Update`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Product
     * @name ProductDelete
     * @request DELETE:/Product/Delete
     */
    productDelete: (
      query: ProductDeleteParams = {},
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/Product/Delete`,
        method: "DELETE",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Product
     * @name ProductSearchProducts
     * @request GET:/Product/SearchProducts
     */
    productSearchProducts: (
      query: ProductSearchProductsParams = {},
      params: RequestParams = {},
    ) =>
      this.request<ProductResponse[], any>({
        path: `/Product/SearchProducts`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags User
     * @name UserGetUsers
     * @request GET:/User/GetUsers
     */
    userGetUsers: (params: RequestParams = {}) =>
      this.request<UserDto[], any>({
        path: `/User/GetUsers`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserGetUserByName
     * @request GET:/User/name/{name}
     */
    userGetUserByName: (
      { name }: UserGetUserByNameParams,
      params: RequestParams = {},
    ) =>
      this.request<UserDto, any>({
        path: `/User/name/${name}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserGetUserById
     * @request GET:/User/id/{id}
     */
    userGetUserById: (
      { id }: UserGetUserByIdParams,
      params: RequestParams = {},
    ) =>
      this.request<UserDto, any>({
        path: `/User/id/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserLogin
     * @request POST:/User/Login
     */
    userLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<UserDto, any>({
        path: `/User/Login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserCreateUser
     * @request POST:/User/CreateUser
     */
    userCreateUser: (data: CreateUserRequestDto, params: RequestParams = {}) =>
      this.request<UserDto, any>({
        path: `/User/CreateUser`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
