
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model submission
 * 
 */
export type submission = $Result.DefaultSelection<Prisma.$submissionPayload>
/**
 * Model domains
 * 
 */
export type domains = $Result.DefaultSelection<Prisma.$domainsPayload>
/**
 * Model login
 * 
 */
export type login = $Result.DefaultSelection<Prisma.$loginPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Submissions
 * const submissions = await prisma.submission.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Submissions
   * const submissions = await prisma.submission.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.submission`: Exposes CRUD operations for the **submission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Submissions
    * const submissions = await prisma.submission.findMany()
    * ```
    */
  get submission(): Prisma.submissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.domains`: Exposes CRUD operations for the **domains** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Domains
    * const domains = await prisma.domains.findMany()
    * ```
    */
  get domains(): Prisma.domainsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.login`: Exposes CRUD operations for the **login** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Logins
    * const logins = await prisma.login.findMany()
    * ```
    */
  get login(): Prisma.loginDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    submission: 'submission',
    domains: 'domains',
    login: 'login'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "submission" | "domains" | "login"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      submission: {
        payload: Prisma.$submissionPayload<ExtArgs>
        fields: Prisma.submissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.submissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$submissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.submissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$submissionPayload>
          }
          findFirst: {
            args: Prisma.submissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$submissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.submissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$submissionPayload>
          }
          findMany: {
            args: Prisma.submissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$submissionPayload>[]
          }
          create: {
            args: Prisma.submissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$submissionPayload>
          }
          createMany: {
            args: Prisma.submissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.submissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$submissionPayload>
          }
          update: {
            args: Prisma.submissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$submissionPayload>
          }
          deleteMany: {
            args: Prisma.submissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.submissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.submissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$submissionPayload>
          }
          aggregate: {
            args: Prisma.SubmissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubmission>
          }
          groupBy: {
            args: Prisma.submissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubmissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.submissionCountArgs<ExtArgs>
            result: $Utils.Optional<SubmissionCountAggregateOutputType> | number
          }
        }
      }
      domains: {
        payload: Prisma.$domainsPayload<ExtArgs>
        fields: Prisma.domainsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.domainsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$domainsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.domainsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$domainsPayload>
          }
          findFirst: {
            args: Prisma.domainsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$domainsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.domainsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$domainsPayload>
          }
          findMany: {
            args: Prisma.domainsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$domainsPayload>[]
          }
          create: {
            args: Prisma.domainsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$domainsPayload>
          }
          createMany: {
            args: Prisma.domainsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.domainsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$domainsPayload>
          }
          update: {
            args: Prisma.domainsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$domainsPayload>
          }
          deleteMany: {
            args: Prisma.domainsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.domainsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.domainsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$domainsPayload>
          }
          aggregate: {
            args: Prisma.DomainsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDomains>
          }
          groupBy: {
            args: Prisma.domainsGroupByArgs<ExtArgs>
            result: $Utils.Optional<DomainsGroupByOutputType>[]
          }
          count: {
            args: Prisma.domainsCountArgs<ExtArgs>
            result: $Utils.Optional<DomainsCountAggregateOutputType> | number
          }
        }
      }
      login: {
        payload: Prisma.$loginPayload<ExtArgs>
        fields: Prisma.loginFieldRefs
        operations: {
          findUnique: {
            args: Prisma.loginFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$loginPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.loginFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$loginPayload>
          }
          findFirst: {
            args: Prisma.loginFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$loginPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.loginFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$loginPayload>
          }
          findMany: {
            args: Prisma.loginFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$loginPayload>[]
          }
          create: {
            args: Prisma.loginCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$loginPayload>
          }
          createMany: {
            args: Prisma.loginCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.loginDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$loginPayload>
          }
          update: {
            args: Prisma.loginUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$loginPayload>
          }
          deleteMany: {
            args: Prisma.loginDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.loginUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.loginUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$loginPayload>
          }
          aggregate: {
            args: Prisma.LoginAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLogin>
          }
          groupBy: {
            args: Prisma.loginGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoginGroupByOutputType>[]
          }
          count: {
            args: Prisma.loginCountArgs<ExtArgs>
            result: $Utils.Optional<LoginCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    submission?: submissionOmit
    domains?: domainsOmit
    login?: loginOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model submission
   */

  export type AggregateSubmission = {
    _count: SubmissionCountAggregateOutputType | null
    _avg: SubmissionAvgAggregateOutputType | null
    _sum: SubmissionSumAggregateOutputType | null
    _min: SubmissionMinAggregateOutputType | null
    _max: SubmissionMaxAggregateOutputType | null
  }

  export type SubmissionAvgAggregateOutputType = {
    id: number | null
  }

  export type SubmissionSumAggregateOutputType = {
    id: number | null
  }

  export type SubmissionMinAggregateOutputType = {
    id: number | null
    techname: string | null
    tl1_desc: string | null
    tl2_desc: string | null
    tl3_desc: string | null
    tl4_desc: string | null
    link: string | null
    displaytext: string | null
    accepted: boolean | null
    username: string | null
    contact: string | null
  }

  export type SubmissionMaxAggregateOutputType = {
    id: number | null
    techname: string | null
    tl1_desc: string | null
    tl2_desc: string | null
    tl3_desc: string | null
    tl4_desc: string | null
    link: string | null
    displaytext: string | null
    accepted: boolean | null
    username: string | null
    contact: string | null
  }

  export type SubmissionCountAggregateOutputType = {
    id: number
    techname: number
    tl1_desc: number
    tl2_desc: number
    tl3_desc: number
    tl4_desc: number
    link: number
    displaytext: number
    accepted: number
    username: number
    contact: number
    _all: number
  }


  export type SubmissionAvgAggregateInputType = {
    id?: true
  }

  export type SubmissionSumAggregateInputType = {
    id?: true
  }

  export type SubmissionMinAggregateInputType = {
    id?: true
    techname?: true
    tl1_desc?: true
    tl2_desc?: true
    tl3_desc?: true
    tl4_desc?: true
    link?: true
    displaytext?: true
    accepted?: true
    username?: true
    contact?: true
  }

  export type SubmissionMaxAggregateInputType = {
    id?: true
    techname?: true
    tl1_desc?: true
    tl2_desc?: true
    tl3_desc?: true
    tl4_desc?: true
    link?: true
    displaytext?: true
    accepted?: true
    username?: true
    contact?: true
  }

  export type SubmissionCountAggregateInputType = {
    id?: true
    techname?: true
    tl1_desc?: true
    tl2_desc?: true
    tl3_desc?: true
    tl4_desc?: true
    link?: true
    displaytext?: true
    accepted?: true
    username?: true
    contact?: true
    _all?: true
  }

  export type SubmissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which submission to aggregate.
     */
    where?: submissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of submissions to fetch.
     */
    orderBy?: submissionOrderByWithRelationInput | submissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: submissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` submissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` submissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned submissions
    **/
    _count?: true | SubmissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubmissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubmissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubmissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubmissionMaxAggregateInputType
  }

  export type GetSubmissionAggregateType<T extends SubmissionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubmission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubmission[P]>
      : GetScalarType<T[P], AggregateSubmission[P]>
  }




  export type submissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: submissionWhereInput
    orderBy?: submissionOrderByWithAggregationInput | submissionOrderByWithAggregationInput[]
    by: SubmissionScalarFieldEnum[] | SubmissionScalarFieldEnum
    having?: submissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubmissionCountAggregateInputType | true
    _avg?: SubmissionAvgAggregateInputType
    _sum?: SubmissionSumAggregateInputType
    _min?: SubmissionMinAggregateInputType
    _max?: SubmissionMaxAggregateInputType
  }

  export type SubmissionGroupByOutputType = {
    id: number
    techname: string
    tl1_desc: string
    tl2_desc: string
    tl3_desc: string
    tl4_desc: string
    link: string
    displaytext: string
    accepted: boolean
    username: string
    contact: string
    _count: SubmissionCountAggregateOutputType | null
    _avg: SubmissionAvgAggregateOutputType | null
    _sum: SubmissionSumAggregateOutputType | null
    _min: SubmissionMinAggregateOutputType | null
    _max: SubmissionMaxAggregateOutputType | null
  }

  type GetSubmissionGroupByPayload<T extends submissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubmissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubmissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubmissionGroupByOutputType[P]>
            : GetScalarType<T[P], SubmissionGroupByOutputType[P]>
        }
      >
    >


  export type submissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    techname?: boolean
    tl1_desc?: boolean
    tl2_desc?: boolean
    tl3_desc?: boolean
    tl4_desc?: boolean
    link?: boolean
    displaytext?: boolean
    accepted?: boolean
    username?: boolean
    contact?: boolean
  }, ExtArgs["result"]["submission"]>



  export type submissionSelectScalar = {
    id?: boolean
    techname?: boolean
    tl1_desc?: boolean
    tl2_desc?: boolean
    tl3_desc?: boolean
    tl4_desc?: boolean
    link?: boolean
    displaytext?: boolean
    accepted?: boolean
    username?: boolean
    contact?: boolean
  }

  export type submissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "techname" | "tl1_desc" | "tl2_desc" | "tl3_desc" | "tl4_desc" | "link" | "displaytext" | "accepted" | "username" | "contact", ExtArgs["result"]["submission"]>

  export type $submissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "submission"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      techname: string
      tl1_desc: string
      tl2_desc: string
      tl3_desc: string
      tl4_desc: string
      link: string
      displaytext: string
      accepted: boolean
      username: string
      contact: string
    }, ExtArgs["result"]["submission"]>
    composites: {}
  }

  type submissionGetPayload<S extends boolean | null | undefined | submissionDefaultArgs> = $Result.GetResult<Prisma.$submissionPayload, S>

  type submissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<submissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubmissionCountAggregateInputType | true
    }

  export interface submissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['submission'], meta: { name: 'submission' } }
    /**
     * Find zero or one Submission that matches the filter.
     * @param {submissionFindUniqueArgs} args - Arguments to find a Submission
     * @example
     * // Get one Submission
     * const submission = await prisma.submission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends submissionFindUniqueArgs>(args: SelectSubset<T, submissionFindUniqueArgs<ExtArgs>>): Prisma__submissionClient<$Result.GetResult<Prisma.$submissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Submission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {submissionFindUniqueOrThrowArgs} args - Arguments to find a Submission
     * @example
     * // Get one Submission
     * const submission = await prisma.submission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends submissionFindUniqueOrThrowArgs>(args: SelectSubset<T, submissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__submissionClient<$Result.GetResult<Prisma.$submissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Submission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {submissionFindFirstArgs} args - Arguments to find a Submission
     * @example
     * // Get one Submission
     * const submission = await prisma.submission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends submissionFindFirstArgs>(args?: SelectSubset<T, submissionFindFirstArgs<ExtArgs>>): Prisma__submissionClient<$Result.GetResult<Prisma.$submissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Submission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {submissionFindFirstOrThrowArgs} args - Arguments to find a Submission
     * @example
     * // Get one Submission
     * const submission = await prisma.submission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends submissionFindFirstOrThrowArgs>(args?: SelectSubset<T, submissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__submissionClient<$Result.GetResult<Prisma.$submissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Submissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {submissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Submissions
     * const submissions = await prisma.submission.findMany()
     * 
     * // Get first 10 Submissions
     * const submissions = await prisma.submission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const submissionWithIdOnly = await prisma.submission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends submissionFindManyArgs>(args?: SelectSubset<T, submissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$submissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Submission.
     * @param {submissionCreateArgs} args - Arguments to create a Submission.
     * @example
     * // Create one Submission
     * const Submission = await prisma.submission.create({
     *   data: {
     *     // ... data to create a Submission
     *   }
     * })
     * 
     */
    create<T extends submissionCreateArgs>(args: SelectSubset<T, submissionCreateArgs<ExtArgs>>): Prisma__submissionClient<$Result.GetResult<Prisma.$submissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Submissions.
     * @param {submissionCreateManyArgs} args - Arguments to create many Submissions.
     * @example
     * // Create many Submissions
     * const submission = await prisma.submission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends submissionCreateManyArgs>(args?: SelectSubset<T, submissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Submission.
     * @param {submissionDeleteArgs} args - Arguments to delete one Submission.
     * @example
     * // Delete one Submission
     * const Submission = await prisma.submission.delete({
     *   where: {
     *     // ... filter to delete one Submission
     *   }
     * })
     * 
     */
    delete<T extends submissionDeleteArgs>(args: SelectSubset<T, submissionDeleteArgs<ExtArgs>>): Prisma__submissionClient<$Result.GetResult<Prisma.$submissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Submission.
     * @param {submissionUpdateArgs} args - Arguments to update one Submission.
     * @example
     * // Update one Submission
     * const submission = await prisma.submission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends submissionUpdateArgs>(args: SelectSubset<T, submissionUpdateArgs<ExtArgs>>): Prisma__submissionClient<$Result.GetResult<Prisma.$submissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Submissions.
     * @param {submissionDeleteManyArgs} args - Arguments to filter Submissions to delete.
     * @example
     * // Delete a few Submissions
     * const { count } = await prisma.submission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends submissionDeleteManyArgs>(args?: SelectSubset<T, submissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Submissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {submissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Submissions
     * const submission = await prisma.submission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends submissionUpdateManyArgs>(args: SelectSubset<T, submissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Submission.
     * @param {submissionUpsertArgs} args - Arguments to update or create a Submission.
     * @example
     * // Update or create a Submission
     * const submission = await prisma.submission.upsert({
     *   create: {
     *     // ... data to create a Submission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Submission we want to update
     *   }
     * })
     */
    upsert<T extends submissionUpsertArgs>(args: SelectSubset<T, submissionUpsertArgs<ExtArgs>>): Prisma__submissionClient<$Result.GetResult<Prisma.$submissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Submissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {submissionCountArgs} args - Arguments to filter Submissions to count.
     * @example
     * // Count the number of Submissions
     * const count = await prisma.submission.count({
     *   where: {
     *     // ... the filter for the Submissions we want to count
     *   }
     * })
    **/
    count<T extends submissionCountArgs>(
      args?: Subset<T, submissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubmissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Submission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubmissionAggregateArgs>(args: Subset<T, SubmissionAggregateArgs>): Prisma.PrismaPromise<GetSubmissionAggregateType<T>>

    /**
     * Group by Submission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {submissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends submissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: submissionGroupByArgs['orderBy'] }
        : { orderBy?: submissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, submissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubmissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the submission model
   */
  readonly fields: submissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for submission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__submissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the submission model
   */
  interface submissionFieldRefs {
    readonly id: FieldRef<"submission", 'Int'>
    readonly techname: FieldRef<"submission", 'String'>
    readonly tl1_desc: FieldRef<"submission", 'String'>
    readonly tl2_desc: FieldRef<"submission", 'String'>
    readonly tl3_desc: FieldRef<"submission", 'String'>
    readonly tl4_desc: FieldRef<"submission", 'String'>
    readonly link: FieldRef<"submission", 'String'>
    readonly displaytext: FieldRef<"submission", 'String'>
    readonly accepted: FieldRef<"submission", 'Boolean'>
    readonly username: FieldRef<"submission", 'String'>
    readonly contact: FieldRef<"submission", 'String'>
  }
    

  // Custom InputTypes
  /**
   * submission findUnique
   */
  export type submissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the submission
     */
    select?: submissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the submission
     */
    omit?: submissionOmit<ExtArgs> | null
    /**
     * Filter, which submission to fetch.
     */
    where: submissionWhereUniqueInput
  }

  /**
   * submission findUniqueOrThrow
   */
  export type submissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the submission
     */
    select?: submissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the submission
     */
    omit?: submissionOmit<ExtArgs> | null
    /**
     * Filter, which submission to fetch.
     */
    where: submissionWhereUniqueInput
  }

  /**
   * submission findFirst
   */
  export type submissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the submission
     */
    select?: submissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the submission
     */
    omit?: submissionOmit<ExtArgs> | null
    /**
     * Filter, which submission to fetch.
     */
    where?: submissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of submissions to fetch.
     */
    orderBy?: submissionOrderByWithRelationInput | submissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for submissions.
     */
    cursor?: submissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` submissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` submissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of submissions.
     */
    distinct?: SubmissionScalarFieldEnum | SubmissionScalarFieldEnum[]
  }

  /**
   * submission findFirstOrThrow
   */
  export type submissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the submission
     */
    select?: submissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the submission
     */
    omit?: submissionOmit<ExtArgs> | null
    /**
     * Filter, which submission to fetch.
     */
    where?: submissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of submissions to fetch.
     */
    orderBy?: submissionOrderByWithRelationInput | submissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for submissions.
     */
    cursor?: submissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` submissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` submissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of submissions.
     */
    distinct?: SubmissionScalarFieldEnum | SubmissionScalarFieldEnum[]
  }

  /**
   * submission findMany
   */
  export type submissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the submission
     */
    select?: submissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the submission
     */
    omit?: submissionOmit<ExtArgs> | null
    /**
     * Filter, which submissions to fetch.
     */
    where?: submissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of submissions to fetch.
     */
    orderBy?: submissionOrderByWithRelationInput | submissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing submissions.
     */
    cursor?: submissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` submissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` submissions.
     */
    skip?: number
    distinct?: SubmissionScalarFieldEnum | SubmissionScalarFieldEnum[]
  }

  /**
   * submission create
   */
  export type submissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the submission
     */
    select?: submissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the submission
     */
    omit?: submissionOmit<ExtArgs> | null
    /**
     * The data needed to create a submission.
     */
    data: XOR<submissionCreateInput, submissionUncheckedCreateInput>
  }

  /**
   * submission createMany
   */
  export type submissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many submissions.
     */
    data: submissionCreateManyInput | submissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * submission update
   */
  export type submissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the submission
     */
    select?: submissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the submission
     */
    omit?: submissionOmit<ExtArgs> | null
    /**
     * The data needed to update a submission.
     */
    data: XOR<submissionUpdateInput, submissionUncheckedUpdateInput>
    /**
     * Choose, which submission to update.
     */
    where: submissionWhereUniqueInput
  }

  /**
   * submission updateMany
   */
  export type submissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update submissions.
     */
    data: XOR<submissionUpdateManyMutationInput, submissionUncheckedUpdateManyInput>
    /**
     * Filter which submissions to update
     */
    where?: submissionWhereInput
    /**
     * Limit how many submissions to update.
     */
    limit?: number
  }

  /**
   * submission upsert
   */
  export type submissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the submission
     */
    select?: submissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the submission
     */
    omit?: submissionOmit<ExtArgs> | null
    /**
     * The filter to search for the submission to update in case it exists.
     */
    where: submissionWhereUniqueInput
    /**
     * In case the submission found by the `where` argument doesn't exist, create a new submission with this data.
     */
    create: XOR<submissionCreateInput, submissionUncheckedCreateInput>
    /**
     * In case the submission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<submissionUpdateInput, submissionUncheckedUpdateInput>
  }

  /**
   * submission delete
   */
  export type submissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the submission
     */
    select?: submissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the submission
     */
    omit?: submissionOmit<ExtArgs> | null
    /**
     * Filter which submission to delete.
     */
    where: submissionWhereUniqueInput
  }

  /**
   * submission deleteMany
   */
  export type submissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which submissions to delete
     */
    where?: submissionWhereInput
    /**
     * Limit how many submissions to delete.
     */
    limit?: number
  }

  /**
   * submission without action
   */
  export type submissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the submission
     */
    select?: submissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the submission
     */
    omit?: submissionOmit<ExtArgs> | null
  }


  /**
   * Model domains
   */

  export type AggregateDomains = {
    _count: DomainsCountAggregateOutputType | null
    _avg: DomainsAvgAggregateOutputType | null
    _sum: DomainsSumAggregateOutputType | null
    _min: DomainsMinAggregateOutputType | null
    _max: DomainsMaxAggregateOutputType | null
  }

  export type DomainsAvgAggregateOutputType = {
    id: number | null
  }

  export type DomainsSumAggregateOutputType = {
    id: number | null
  }

  export type DomainsMinAggregateOutputType = {
    id: number | null
    R: boolean | null
    TP: boolean | null
    MT: boolean | null
    AR: boolean | null
    U: boolean | null
    MDL: boolean | null
    RA: boolean | null
    RoTech: boolean | null
    LS: boolean | null
    RoThink: boolean | null
    EoST: boolean | null
    EF: boolean | null
    RTE: boolean | null
    DLoI: boolean | null
    RaAoC: boolean | null
  }

  export type DomainsMaxAggregateOutputType = {
    id: number | null
    R: boolean | null
    TP: boolean | null
    MT: boolean | null
    AR: boolean | null
    U: boolean | null
    MDL: boolean | null
    RA: boolean | null
    RoTech: boolean | null
    LS: boolean | null
    RoThink: boolean | null
    EoST: boolean | null
    EF: boolean | null
    RTE: boolean | null
    DLoI: boolean | null
    RaAoC: boolean | null
  }

  export type DomainsCountAggregateOutputType = {
    id: number
    R: number
    TP: number
    MT: number
    AR: number
    U: number
    MDL: number
    RA: number
    RoTech: number
    LS: number
    RoThink: number
    EoST: number
    EF: number
    RTE: number
    DLoI: number
    RaAoC: number
    _all: number
  }


  export type DomainsAvgAggregateInputType = {
    id?: true
  }

  export type DomainsSumAggregateInputType = {
    id?: true
  }

  export type DomainsMinAggregateInputType = {
    id?: true
    R?: true
    TP?: true
    MT?: true
    AR?: true
    U?: true
    MDL?: true
    RA?: true
    RoTech?: true
    LS?: true
    RoThink?: true
    EoST?: true
    EF?: true
    RTE?: true
    DLoI?: true
    RaAoC?: true
  }

  export type DomainsMaxAggregateInputType = {
    id?: true
    R?: true
    TP?: true
    MT?: true
    AR?: true
    U?: true
    MDL?: true
    RA?: true
    RoTech?: true
    LS?: true
    RoThink?: true
    EoST?: true
    EF?: true
    RTE?: true
    DLoI?: true
    RaAoC?: true
  }

  export type DomainsCountAggregateInputType = {
    id?: true
    R?: true
    TP?: true
    MT?: true
    AR?: true
    U?: true
    MDL?: true
    RA?: true
    RoTech?: true
    LS?: true
    RoThink?: true
    EoST?: true
    EF?: true
    RTE?: true
    DLoI?: true
    RaAoC?: true
    _all?: true
  }

  export type DomainsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which domains to aggregate.
     */
    where?: domainsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of domains to fetch.
     */
    orderBy?: domainsOrderByWithRelationInput | domainsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: domainsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` domains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` domains.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned domains
    **/
    _count?: true | DomainsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DomainsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DomainsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DomainsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DomainsMaxAggregateInputType
  }

  export type GetDomainsAggregateType<T extends DomainsAggregateArgs> = {
        [P in keyof T & keyof AggregateDomains]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDomains[P]>
      : GetScalarType<T[P], AggregateDomains[P]>
  }




  export type domainsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: domainsWhereInput
    orderBy?: domainsOrderByWithAggregationInput | domainsOrderByWithAggregationInput[]
    by: DomainsScalarFieldEnum[] | DomainsScalarFieldEnum
    having?: domainsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DomainsCountAggregateInputType | true
    _avg?: DomainsAvgAggregateInputType
    _sum?: DomainsSumAggregateInputType
    _min?: DomainsMinAggregateInputType
    _max?: DomainsMaxAggregateInputType
  }

  export type DomainsGroupByOutputType = {
    id: number
    R: boolean
    TP: boolean
    MT: boolean
    AR: boolean
    U: boolean
    MDL: boolean
    RA: boolean
    RoTech: boolean
    LS: boolean
    RoThink: boolean
    EoST: boolean
    EF: boolean
    RTE: boolean
    DLoI: boolean
    RaAoC: boolean
    _count: DomainsCountAggregateOutputType | null
    _avg: DomainsAvgAggregateOutputType | null
    _sum: DomainsSumAggregateOutputType | null
    _min: DomainsMinAggregateOutputType | null
    _max: DomainsMaxAggregateOutputType | null
  }

  type GetDomainsGroupByPayload<T extends domainsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DomainsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DomainsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DomainsGroupByOutputType[P]>
            : GetScalarType<T[P], DomainsGroupByOutputType[P]>
        }
      >
    >


  export type domainsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    R?: boolean
    TP?: boolean
    MT?: boolean
    AR?: boolean
    U?: boolean
    MDL?: boolean
    RA?: boolean
    RoTech?: boolean
    LS?: boolean
    RoThink?: boolean
    EoST?: boolean
    EF?: boolean
    RTE?: boolean
    DLoI?: boolean
    RaAoC?: boolean
  }, ExtArgs["result"]["domains"]>



  export type domainsSelectScalar = {
    id?: boolean
    R?: boolean
    TP?: boolean
    MT?: boolean
    AR?: boolean
    U?: boolean
    MDL?: boolean
    RA?: boolean
    RoTech?: boolean
    LS?: boolean
    RoThink?: boolean
    EoST?: boolean
    EF?: boolean
    RTE?: boolean
    DLoI?: boolean
    RaAoC?: boolean
  }

  export type domainsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "R" | "TP" | "MT" | "AR" | "U" | "MDL" | "RA" | "RoTech" | "LS" | "RoThink" | "EoST" | "EF" | "RTE" | "DLoI" | "RaAoC", ExtArgs["result"]["domains"]>

  export type $domainsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "domains"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      R: boolean
      TP: boolean
      MT: boolean
      AR: boolean
      U: boolean
      MDL: boolean
      RA: boolean
      RoTech: boolean
      LS: boolean
      RoThink: boolean
      EoST: boolean
      EF: boolean
      RTE: boolean
      DLoI: boolean
      RaAoC: boolean
    }, ExtArgs["result"]["domains"]>
    composites: {}
  }

  type domainsGetPayload<S extends boolean | null | undefined | domainsDefaultArgs> = $Result.GetResult<Prisma.$domainsPayload, S>

  type domainsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<domainsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DomainsCountAggregateInputType | true
    }

  export interface domainsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['domains'], meta: { name: 'domains' } }
    /**
     * Find zero or one Domains that matches the filter.
     * @param {domainsFindUniqueArgs} args - Arguments to find a Domains
     * @example
     * // Get one Domains
     * const domains = await prisma.domains.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends domainsFindUniqueArgs>(args: SelectSubset<T, domainsFindUniqueArgs<ExtArgs>>): Prisma__domainsClient<$Result.GetResult<Prisma.$domainsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Domains that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {domainsFindUniqueOrThrowArgs} args - Arguments to find a Domains
     * @example
     * // Get one Domains
     * const domains = await prisma.domains.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends domainsFindUniqueOrThrowArgs>(args: SelectSubset<T, domainsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__domainsClient<$Result.GetResult<Prisma.$domainsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Domains that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {domainsFindFirstArgs} args - Arguments to find a Domains
     * @example
     * // Get one Domains
     * const domains = await prisma.domains.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends domainsFindFirstArgs>(args?: SelectSubset<T, domainsFindFirstArgs<ExtArgs>>): Prisma__domainsClient<$Result.GetResult<Prisma.$domainsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Domains that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {domainsFindFirstOrThrowArgs} args - Arguments to find a Domains
     * @example
     * // Get one Domains
     * const domains = await prisma.domains.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends domainsFindFirstOrThrowArgs>(args?: SelectSubset<T, domainsFindFirstOrThrowArgs<ExtArgs>>): Prisma__domainsClient<$Result.GetResult<Prisma.$domainsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Domains that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {domainsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Domains
     * const domains = await prisma.domains.findMany()
     * 
     * // Get first 10 Domains
     * const domains = await prisma.domains.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const domainsWithIdOnly = await prisma.domains.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends domainsFindManyArgs>(args?: SelectSubset<T, domainsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$domainsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Domains.
     * @param {domainsCreateArgs} args - Arguments to create a Domains.
     * @example
     * // Create one Domains
     * const Domains = await prisma.domains.create({
     *   data: {
     *     // ... data to create a Domains
     *   }
     * })
     * 
     */
    create<T extends domainsCreateArgs>(args: SelectSubset<T, domainsCreateArgs<ExtArgs>>): Prisma__domainsClient<$Result.GetResult<Prisma.$domainsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Domains.
     * @param {domainsCreateManyArgs} args - Arguments to create many Domains.
     * @example
     * // Create many Domains
     * const domains = await prisma.domains.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends domainsCreateManyArgs>(args?: SelectSubset<T, domainsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Domains.
     * @param {domainsDeleteArgs} args - Arguments to delete one Domains.
     * @example
     * // Delete one Domains
     * const Domains = await prisma.domains.delete({
     *   where: {
     *     // ... filter to delete one Domains
     *   }
     * })
     * 
     */
    delete<T extends domainsDeleteArgs>(args: SelectSubset<T, domainsDeleteArgs<ExtArgs>>): Prisma__domainsClient<$Result.GetResult<Prisma.$domainsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Domains.
     * @param {domainsUpdateArgs} args - Arguments to update one Domains.
     * @example
     * // Update one Domains
     * const domains = await prisma.domains.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends domainsUpdateArgs>(args: SelectSubset<T, domainsUpdateArgs<ExtArgs>>): Prisma__domainsClient<$Result.GetResult<Prisma.$domainsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Domains.
     * @param {domainsDeleteManyArgs} args - Arguments to filter Domains to delete.
     * @example
     * // Delete a few Domains
     * const { count } = await prisma.domains.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends domainsDeleteManyArgs>(args?: SelectSubset<T, domainsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Domains.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {domainsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Domains
     * const domains = await prisma.domains.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends domainsUpdateManyArgs>(args: SelectSubset<T, domainsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Domains.
     * @param {domainsUpsertArgs} args - Arguments to update or create a Domains.
     * @example
     * // Update or create a Domains
     * const domains = await prisma.domains.upsert({
     *   create: {
     *     // ... data to create a Domains
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Domains we want to update
     *   }
     * })
     */
    upsert<T extends domainsUpsertArgs>(args: SelectSubset<T, domainsUpsertArgs<ExtArgs>>): Prisma__domainsClient<$Result.GetResult<Prisma.$domainsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Domains.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {domainsCountArgs} args - Arguments to filter Domains to count.
     * @example
     * // Count the number of Domains
     * const count = await prisma.domains.count({
     *   where: {
     *     // ... the filter for the Domains we want to count
     *   }
     * })
    **/
    count<T extends domainsCountArgs>(
      args?: Subset<T, domainsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DomainsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Domains.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DomainsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DomainsAggregateArgs>(args: Subset<T, DomainsAggregateArgs>): Prisma.PrismaPromise<GetDomainsAggregateType<T>>

    /**
     * Group by Domains.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {domainsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends domainsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: domainsGroupByArgs['orderBy'] }
        : { orderBy?: domainsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, domainsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDomainsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the domains model
   */
  readonly fields: domainsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for domains.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__domainsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the domains model
   */
  interface domainsFieldRefs {
    readonly id: FieldRef<"domains", 'Int'>
    readonly R: FieldRef<"domains", 'Boolean'>
    readonly TP: FieldRef<"domains", 'Boolean'>
    readonly MT: FieldRef<"domains", 'Boolean'>
    readonly AR: FieldRef<"domains", 'Boolean'>
    readonly U: FieldRef<"domains", 'Boolean'>
    readonly MDL: FieldRef<"domains", 'Boolean'>
    readonly RA: FieldRef<"domains", 'Boolean'>
    readonly RoTech: FieldRef<"domains", 'Boolean'>
    readonly LS: FieldRef<"domains", 'Boolean'>
    readonly RoThink: FieldRef<"domains", 'Boolean'>
    readonly EoST: FieldRef<"domains", 'Boolean'>
    readonly EF: FieldRef<"domains", 'Boolean'>
    readonly RTE: FieldRef<"domains", 'Boolean'>
    readonly DLoI: FieldRef<"domains", 'Boolean'>
    readonly RaAoC: FieldRef<"domains", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * domains findUnique
   */
  export type domainsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the domains
     */
    select?: domainsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the domains
     */
    omit?: domainsOmit<ExtArgs> | null
    /**
     * Filter, which domains to fetch.
     */
    where: domainsWhereUniqueInput
  }

  /**
   * domains findUniqueOrThrow
   */
  export type domainsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the domains
     */
    select?: domainsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the domains
     */
    omit?: domainsOmit<ExtArgs> | null
    /**
     * Filter, which domains to fetch.
     */
    where: domainsWhereUniqueInput
  }

  /**
   * domains findFirst
   */
  export type domainsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the domains
     */
    select?: domainsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the domains
     */
    omit?: domainsOmit<ExtArgs> | null
    /**
     * Filter, which domains to fetch.
     */
    where?: domainsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of domains to fetch.
     */
    orderBy?: domainsOrderByWithRelationInput | domainsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for domains.
     */
    cursor?: domainsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` domains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` domains.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of domains.
     */
    distinct?: DomainsScalarFieldEnum | DomainsScalarFieldEnum[]
  }

  /**
   * domains findFirstOrThrow
   */
  export type domainsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the domains
     */
    select?: domainsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the domains
     */
    omit?: domainsOmit<ExtArgs> | null
    /**
     * Filter, which domains to fetch.
     */
    where?: domainsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of domains to fetch.
     */
    orderBy?: domainsOrderByWithRelationInput | domainsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for domains.
     */
    cursor?: domainsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` domains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` domains.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of domains.
     */
    distinct?: DomainsScalarFieldEnum | DomainsScalarFieldEnum[]
  }

  /**
   * domains findMany
   */
  export type domainsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the domains
     */
    select?: domainsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the domains
     */
    omit?: domainsOmit<ExtArgs> | null
    /**
     * Filter, which domains to fetch.
     */
    where?: domainsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of domains to fetch.
     */
    orderBy?: domainsOrderByWithRelationInput | domainsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing domains.
     */
    cursor?: domainsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` domains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` domains.
     */
    skip?: number
    distinct?: DomainsScalarFieldEnum | DomainsScalarFieldEnum[]
  }

  /**
   * domains create
   */
  export type domainsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the domains
     */
    select?: domainsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the domains
     */
    omit?: domainsOmit<ExtArgs> | null
    /**
     * The data needed to create a domains.
     */
    data: XOR<domainsCreateInput, domainsUncheckedCreateInput>
  }

  /**
   * domains createMany
   */
  export type domainsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many domains.
     */
    data: domainsCreateManyInput | domainsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * domains update
   */
  export type domainsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the domains
     */
    select?: domainsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the domains
     */
    omit?: domainsOmit<ExtArgs> | null
    /**
     * The data needed to update a domains.
     */
    data: XOR<domainsUpdateInput, domainsUncheckedUpdateInput>
    /**
     * Choose, which domains to update.
     */
    where: domainsWhereUniqueInput
  }

  /**
   * domains updateMany
   */
  export type domainsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update domains.
     */
    data: XOR<domainsUpdateManyMutationInput, domainsUncheckedUpdateManyInput>
    /**
     * Filter which domains to update
     */
    where?: domainsWhereInput
    /**
     * Limit how many domains to update.
     */
    limit?: number
  }

  /**
   * domains upsert
   */
  export type domainsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the domains
     */
    select?: domainsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the domains
     */
    omit?: domainsOmit<ExtArgs> | null
    /**
     * The filter to search for the domains to update in case it exists.
     */
    where: domainsWhereUniqueInput
    /**
     * In case the domains found by the `where` argument doesn't exist, create a new domains with this data.
     */
    create: XOR<domainsCreateInput, domainsUncheckedCreateInput>
    /**
     * In case the domains was found with the provided `where` argument, update it with this data.
     */
    update: XOR<domainsUpdateInput, domainsUncheckedUpdateInput>
  }

  /**
   * domains delete
   */
  export type domainsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the domains
     */
    select?: domainsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the domains
     */
    omit?: domainsOmit<ExtArgs> | null
    /**
     * Filter which domains to delete.
     */
    where: domainsWhereUniqueInput
  }

  /**
   * domains deleteMany
   */
  export type domainsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which domains to delete
     */
    where?: domainsWhereInput
    /**
     * Limit how many domains to delete.
     */
    limit?: number
  }

  /**
   * domains without action
   */
  export type domainsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the domains
     */
    select?: domainsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the domains
     */
    omit?: domainsOmit<ExtArgs> | null
  }


  /**
   * Model login
   */

  export type AggregateLogin = {
    _count: LoginCountAggregateOutputType | null
    _min: LoginMinAggregateOutputType | null
    _max: LoginMaxAggregateOutputType | null
  }

  export type LoginMinAggregateOutputType = {
    User: string | null
    PW: string | null
  }

  export type LoginMaxAggregateOutputType = {
    User: string | null
    PW: string | null
  }

  export type LoginCountAggregateOutputType = {
    User: number
    PW: number
    _all: number
  }


  export type LoginMinAggregateInputType = {
    User?: true
    PW?: true
  }

  export type LoginMaxAggregateInputType = {
    User?: true
    PW?: true
  }

  export type LoginCountAggregateInputType = {
    User?: true
    PW?: true
    _all?: true
  }

  export type LoginAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which login to aggregate.
     */
    where?: loginWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of logins to fetch.
     */
    orderBy?: loginOrderByWithRelationInput | loginOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: loginWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` logins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` logins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned logins
    **/
    _count?: true | LoginCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoginMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoginMaxAggregateInputType
  }

  export type GetLoginAggregateType<T extends LoginAggregateArgs> = {
        [P in keyof T & keyof AggregateLogin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLogin[P]>
      : GetScalarType<T[P], AggregateLogin[P]>
  }




  export type loginGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: loginWhereInput
    orderBy?: loginOrderByWithAggregationInput | loginOrderByWithAggregationInput[]
    by: LoginScalarFieldEnum[] | LoginScalarFieldEnum
    having?: loginScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoginCountAggregateInputType | true
    _min?: LoginMinAggregateInputType
    _max?: LoginMaxAggregateInputType
  }

  export type LoginGroupByOutputType = {
    User: string
    PW: string
    _count: LoginCountAggregateOutputType | null
    _min: LoginMinAggregateOutputType | null
    _max: LoginMaxAggregateOutputType | null
  }

  type GetLoginGroupByPayload<T extends loginGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoginGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoginGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoginGroupByOutputType[P]>
            : GetScalarType<T[P], LoginGroupByOutputType[P]>
        }
      >
    >


  export type loginSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    User?: boolean
    PW?: boolean
  }, ExtArgs["result"]["login"]>



  export type loginSelectScalar = {
    User?: boolean
    PW?: boolean
  }

  export type loginOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"User" | "PW", ExtArgs["result"]["login"]>

  export type $loginPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "login"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      User: string
      PW: string
    }, ExtArgs["result"]["login"]>
    composites: {}
  }

  type loginGetPayload<S extends boolean | null | undefined | loginDefaultArgs> = $Result.GetResult<Prisma.$loginPayload, S>

  type loginCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<loginFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoginCountAggregateInputType | true
    }

  export interface loginDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['login'], meta: { name: 'login' } }
    /**
     * Find zero or one Login that matches the filter.
     * @param {loginFindUniqueArgs} args - Arguments to find a Login
     * @example
     * // Get one Login
     * const login = await prisma.login.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends loginFindUniqueArgs>(args: SelectSubset<T, loginFindUniqueArgs<ExtArgs>>): Prisma__loginClient<$Result.GetResult<Prisma.$loginPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Login that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {loginFindUniqueOrThrowArgs} args - Arguments to find a Login
     * @example
     * // Get one Login
     * const login = await prisma.login.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends loginFindUniqueOrThrowArgs>(args: SelectSubset<T, loginFindUniqueOrThrowArgs<ExtArgs>>): Prisma__loginClient<$Result.GetResult<Prisma.$loginPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Login that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {loginFindFirstArgs} args - Arguments to find a Login
     * @example
     * // Get one Login
     * const login = await prisma.login.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends loginFindFirstArgs>(args?: SelectSubset<T, loginFindFirstArgs<ExtArgs>>): Prisma__loginClient<$Result.GetResult<Prisma.$loginPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Login that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {loginFindFirstOrThrowArgs} args - Arguments to find a Login
     * @example
     * // Get one Login
     * const login = await prisma.login.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends loginFindFirstOrThrowArgs>(args?: SelectSubset<T, loginFindFirstOrThrowArgs<ExtArgs>>): Prisma__loginClient<$Result.GetResult<Prisma.$loginPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Logins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {loginFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Logins
     * const logins = await prisma.login.findMany()
     * 
     * // Get first 10 Logins
     * const logins = await prisma.login.findMany({ take: 10 })
     * 
     * // Only select the `User`
     * const loginWithUserOnly = await prisma.login.findMany({ select: { User: true } })
     * 
     */
    findMany<T extends loginFindManyArgs>(args?: SelectSubset<T, loginFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$loginPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Login.
     * @param {loginCreateArgs} args - Arguments to create a Login.
     * @example
     * // Create one Login
     * const Login = await prisma.login.create({
     *   data: {
     *     // ... data to create a Login
     *   }
     * })
     * 
     */
    create<T extends loginCreateArgs>(args: SelectSubset<T, loginCreateArgs<ExtArgs>>): Prisma__loginClient<$Result.GetResult<Prisma.$loginPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Logins.
     * @param {loginCreateManyArgs} args - Arguments to create many Logins.
     * @example
     * // Create many Logins
     * const login = await prisma.login.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends loginCreateManyArgs>(args?: SelectSubset<T, loginCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Login.
     * @param {loginDeleteArgs} args - Arguments to delete one Login.
     * @example
     * // Delete one Login
     * const Login = await prisma.login.delete({
     *   where: {
     *     // ... filter to delete one Login
     *   }
     * })
     * 
     */
    delete<T extends loginDeleteArgs>(args: SelectSubset<T, loginDeleteArgs<ExtArgs>>): Prisma__loginClient<$Result.GetResult<Prisma.$loginPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Login.
     * @param {loginUpdateArgs} args - Arguments to update one Login.
     * @example
     * // Update one Login
     * const login = await prisma.login.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends loginUpdateArgs>(args: SelectSubset<T, loginUpdateArgs<ExtArgs>>): Prisma__loginClient<$Result.GetResult<Prisma.$loginPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Logins.
     * @param {loginDeleteManyArgs} args - Arguments to filter Logins to delete.
     * @example
     * // Delete a few Logins
     * const { count } = await prisma.login.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends loginDeleteManyArgs>(args?: SelectSubset<T, loginDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Logins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {loginUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Logins
     * const login = await prisma.login.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends loginUpdateManyArgs>(args: SelectSubset<T, loginUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Login.
     * @param {loginUpsertArgs} args - Arguments to update or create a Login.
     * @example
     * // Update or create a Login
     * const login = await prisma.login.upsert({
     *   create: {
     *     // ... data to create a Login
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Login we want to update
     *   }
     * })
     */
    upsert<T extends loginUpsertArgs>(args: SelectSubset<T, loginUpsertArgs<ExtArgs>>): Prisma__loginClient<$Result.GetResult<Prisma.$loginPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Logins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {loginCountArgs} args - Arguments to filter Logins to count.
     * @example
     * // Count the number of Logins
     * const count = await prisma.login.count({
     *   where: {
     *     // ... the filter for the Logins we want to count
     *   }
     * })
    **/
    count<T extends loginCountArgs>(
      args?: Subset<T, loginCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoginCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Login.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoginAggregateArgs>(args: Subset<T, LoginAggregateArgs>): Prisma.PrismaPromise<GetLoginAggregateType<T>>

    /**
     * Group by Login.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {loginGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends loginGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: loginGroupByArgs['orderBy'] }
        : { orderBy?: loginGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, loginGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoginGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the login model
   */
  readonly fields: loginFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for login.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__loginClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the login model
   */
  interface loginFieldRefs {
    readonly User: FieldRef<"login", 'String'>
    readonly PW: FieldRef<"login", 'String'>
  }
    

  // Custom InputTypes
  /**
   * login findUnique
   */
  export type loginFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the login
     */
    select?: loginSelect<ExtArgs> | null
    /**
     * Omit specific fields from the login
     */
    omit?: loginOmit<ExtArgs> | null
    /**
     * Filter, which login to fetch.
     */
    where: loginWhereUniqueInput
  }

  /**
   * login findUniqueOrThrow
   */
  export type loginFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the login
     */
    select?: loginSelect<ExtArgs> | null
    /**
     * Omit specific fields from the login
     */
    omit?: loginOmit<ExtArgs> | null
    /**
     * Filter, which login to fetch.
     */
    where: loginWhereUniqueInput
  }

  /**
   * login findFirst
   */
  export type loginFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the login
     */
    select?: loginSelect<ExtArgs> | null
    /**
     * Omit specific fields from the login
     */
    omit?: loginOmit<ExtArgs> | null
    /**
     * Filter, which login to fetch.
     */
    where?: loginWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of logins to fetch.
     */
    orderBy?: loginOrderByWithRelationInput | loginOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for logins.
     */
    cursor?: loginWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` logins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` logins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of logins.
     */
    distinct?: LoginScalarFieldEnum | LoginScalarFieldEnum[]
  }

  /**
   * login findFirstOrThrow
   */
  export type loginFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the login
     */
    select?: loginSelect<ExtArgs> | null
    /**
     * Omit specific fields from the login
     */
    omit?: loginOmit<ExtArgs> | null
    /**
     * Filter, which login to fetch.
     */
    where?: loginWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of logins to fetch.
     */
    orderBy?: loginOrderByWithRelationInput | loginOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for logins.
     */
    cursor?: loginWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` logins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` logins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of logins.
     */
    distinct?: LoginScalarFieldEnum | LoginScalarFieldEnum[]
  }

  /**
   * login findMany
   */
  export type loginFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the login
     */
    select?: loginSelect<ExtArgs> | null
    /**
     * Omit specific fields from the login
     */
    omit?: loginOmit<ExtArgs> | null
    /**
     * Filter, which logins to fetch.
     */
    where?: loginWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of logins to fetch.
     */
    orderBy?: loginOrderByWithRelationInput | loginOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing logins.
     */
    cursor?: loginWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` logins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` logins.
     */
    skip?: number
    distinct?: LoginScalarFieldEnum | LoginScalarFieldEnum[]
  }

  /**
   * login create
   */
  export type loginCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the login
     */
    select?: loginSelect<ExtArgs> | null
    /**
     * Omit specific fields from the login
     */
    omit?: loginOmit<ExtArgs> | null
    /**
     * The data needed to create a login.
     */
    data: XOR<loginCreateInput, loginUncheckedCreateInput>
  }

  /**
   * login createMany
   */
  export type loginCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many logins.
     */
    data: loginCreateManyInput | loginCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * login update
   */
  export type loginUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the login
     */
    select?: loginSelect<ExtArgs> | null
    /**
     * Omit specific fields from the login
     */
    omit?: loginOmit<ExtArgs> | null
    /**
     * The data needed to update a login.
     */
    data: XOR<loginUpdateInput, loginUncheckedUpdateInput>
    /**
     * Choose, which login to update.
     */
    where: loginWhereUniqueInput
  }

  /**
   * login updateMany
   */
  export type loginUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update logins.
     */
    data: XOR<loginUpdateManyMutationInput, loginUncheckedUpdateManyInput>
    /**
     * Filter which logins to update
     */
    where?: loginWhereInput
    /**
     * Limit how many logins to update.
     */
    limit?: number
  }

  /**
   * login upsert
   */
  export type loginUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the login
     */
    select?: loginSelect<ExtArgs> | null
    /**
     * Omit specific fields from the login
     */
    omit?: loginOmit<ExtArgs> | null
    /**
     * The filter to search for the login to update in case it exists.
     */
    where: loginWhereUniqueInput
    /**
     * In case the login found by the `where` argument doesn't exist, create a new login with this data.
     */
    create: XOR<loginCreateInput, loginUncheckedCreateInput>
    /**
     * In case the login was found with the provided `where` argument, update it with this data.
     */
    update: XOR<loginUpdateInput, loginUncheckedUpdateInput>
  }

  /**
   * login delete
   */
  export type loginDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the login
     */
    select?: loginSelect<ExtArgs> | null
    /**
     * Omit specific fields from the login
     */
    omit?: loginOmit<ExtArgs> | null
    /**
     * Filter which login to delete.
     */
    where: loginWhereUniqueInput
  }

  /**
   * login deleteMany
   */
  export type loginDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which logins to delete
     */
    where?: loginWhereInput
    /**
     * Limit how many logins to delete.
     */
    limit?: number
  }

  /**
   * login without action
   */
  export type loginDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the login
     */
    select?: loginSelect<ExtArgs> | null
    /**
     * Omit specific fields from the login
     */
    omit?: loginOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SubmissionScalarFieldEnum: {
    id: 'id',
    techname: 'techname',
    tl1_desc: 'tl1_desc',
    tl2_desc: 'tl2_desc',
    tl3_desc: 'tl3_desc',
    tl4_desc: 'tl4_desc',
    link: 'link',
    displaytext: 'displaytext',
    accepted: 'accepted',
    username: 'username',
    contact: 'contact'
  };

  export type SubmissionScalarFieldEnum = (typeof SubmissionScalarFieldEnum)[keyof typeof SubmissionScalarFieldEnum]


  export const DomainsScalarFieldEnum: {
    id: 'id',
    R: 'R',
    TP: 'TP',
    MT: 'MT',
    AR: 'AR',
    U: 'U',
    MDL: 'MDL',
    RA: 'RA',
    RoTech: 'RoTech',
    LS: 'LS',
    RoThink: 'RoThink',
    EoST: 'EoST',
    EF: 'EF',
    RTE: 'RTE',
    DLoI: 'DLoI',
    RaAoC: 'RaAoC'
  };

  export type DomainsScalarFieldEnum = (typeof DomainsScalarFieldEnum)[keyof typeof DomainsScalarFieldEnum]


  export const LoginScalarFieldEnum: {
    User: 'User',
    PW: 'PW'
  };

  export type LoginScalarFieldEnum = (typeof LoginScalarFieldEnum)[keyof typeof LoginScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const submissionOrderByRelevanceFieldEnum: {
    techname: 'techname',
    tl1_desc: 'tl1_desc',
    tl2_desc: 'tl2_desc',
    tl3_desc: 'tl3_desc',
    tl4_desc: 'tl4_desc',
    link: 'link',
    displaytext: 'displaytext',
    username: 'username',
    contact: 'contact'
  };

  export type submissionOrderByRelevanceFieldEnum = (typeof submissionOrderByRelevanceFieldEnum)[keyof typeof submissionOrderByRelevanceFieldEnum]


  export const loginOrderByRelevanceFieldEnum: {
    User: 'User',
    PW: 'PW'
  };

  export type loginOrderByRelevanceFieldEnum = (typeof loginOrderByRelevanceFieldEnum)[keyof typeof loginOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type submissionWhereInput = {
    AND?: submissionWhereInput | submissionWhereInput[]
    OR?: submissionWhereInput[]
    NOT?: submissionWhereInput | submissionWhereInput[]
    id?: IntFilter<"submission"> | number
    techname?: StringFilter<"submission"> | string
    tl1_desc?: StringFilter<"submission"> | string
    tl2_desc?: StringFilter<"submission"> | string
    tl3_desc?: StringFilter<"submission"> | string
    tl4_desc?: StringFilter<"submission"> | string
    link?: StringFilter<"submission"> | string
    displaytext?: StringFilter<"submission"> | string
    accepted?: BoolFilter<"submission"> | boolean
    username?: StringFilter<"submission"> | string
    contact?: StringFilter<"submission"> | string
  }

  export type submissionOrderByWithRelationInput = {
    id?: SortOrder
    techname?: SortOrder
    tl1_desc?: SortOrder
    tl2_desc?: SortOrder
    tl3_desc?: SortOrder
    tl4_desc?: SortOrder
    link?: SortOrder
    displaytext?: SortOrder
    accepted?: SortOrder
    username?: SortOrder
    contact?: SortOrder
    _relevance?: submissionOrderByRelevanceInput
  }

  export type submissionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: submissionWhereInput | submissionWhereInput[]
    OR?: submissionWhereInput[]
    NOT?: submissionWhereInput | submissionWhereInput[]
    techname?: StringFilter<"submission"> | string
    tl1_desc?: StringFilter<"submission"> | string
    tl2_desc?: StringFilter<"submission"> | string
    tl3_desc?: StringFilter<"submission"> | string
    tl4_desc?: StringFilter<"submission"> | string
    link?: StringFilter<"submission"> | string
    displaytext?: StringFilter<"submission"> | string
    accepted?: BoolFilter<"submission"> | boolean
    username?: StringFilter<"submission"> | string
    contact?: StringFilter<"submission"> | string
  }, "id">

  export type submissionOrderByWithAggregationInput = {
    id?: SortOrder
    techname?: SortOrder
    tl1_desc?: SortOrder
    tl2_desc?: SortOrder
    tl3_desc?: SortOrder
    tl4_desc?: SortOrder
    link?: SortOrder
    displaytext?: SortOrder
    accepted?: SortOrder
    username?: SortOrder
    contact?: SortOrder
    _count?: submissionCountOrderByAggregateInput
    _avg?: submissionAvgOrderByAggregateInput
    _max?: submissionMaxOrderByAggregateInput
    _min?: submissionMinOrderByAggregateInput
    _sum?: submissionSumOrderByAggregateInput
  }

  export type submissionScalarWhereWithAggregatesInput = {
    AND?: submissionScalarWhereWithAggregatesInput | submissionScalarWhereWithAggregatesInput[]
    OR?: submissionScalarWhereWithAggregatesInput[]
    NOT?: submissionScalarWhereWithAggregatesInput | submissionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"submission"> | number
    techname?: StringWithAggregatesFilter<"submission"> | string
    tl1_desc?: StringWithAggregatesFilter<"submission"> | string
    tl2_desc?: StringWithAggregatesFilter<"submission"> | string
    tl3_desc?: StringWithAggregatesFilter<"submission"> | string
    tl4_desc?: StringWithAggregatesFilter<"submission"> | string
    link?: StringWithAggregatesFilter<"submission"> | string
    displaytext?: StringWithAggregatesFilter<"submission"> | string
    accepted?: BoolWithAggregatesFilter<"submission"> | boolean
    username?: StringWithAggregatesFilter<"submission"> | string
    contact?: StringWithAggregatesFilter<"submission"> | string
  }

  export type domainsWhereInput = {
    AND?: domainsWhereInput | domainsWhereInput[]
    OR?: domainsWhereInput[]
    NOT?: domainsWhereInput | domainsWhereInput[]
    id?: IntFilter<"domains"> | number
    R?: BoolFilter<"domains"> | boolean
    TP?: BoolFilter<"domains"> | boolean
    MT?: BoolFilter<"domains"> | boolean
    AR?: BoolFilter<"domains"> | boolean
    U?: BoolFilter<"domains"> | boolean
    MDL?: BoolFilter<"domains"> | boolean
    RA?: BoolFilter<"domains"> | boolean
    RoTech?: BoolFilter<"domains"> | boolean
    LS?: BoolFilter<"domains"> | boolean
    RoThink?: BoolFilter<"domains"> | boolean
    EoST?: BoolFilter<"domains"> | boolean
    EF?: BoolFilter<"domains"> | boolean
    RTE?: BoolFilter<"domains"> | boolean
    DLoI?: BoolFilter<"domains"> | boolean
    RaAoC?: BoolFilter<"domains"> | boolean
  }

  export type domainsOrderByWithRelationInput = {
    id?: SortOrder
    R?: SortOrder
    TP?: SortOrder
    MT?: SortOrder
    AR?: SortOrder
    U?: SortOrder
    MDL?: SortOrder
    RA?: SortOrder
    RoTech?: SortOrder
    LS?: SortOrder
    RoThink?: SortOrder
    EoST?: SortOrder
    EF?: SortOrder
    RTE?: SortOrder
    DLoI?: SortOrder
    RaAoC?: SortOrder
  }

  export type domainsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: domainsWhereInput | domainsWhereInput[]
    OR?: domainsWhereInput[]
    NOT?: domainsWhereInput | domainsWhereInput[]
    R?: BoolFilter<"domains"> | boolean
    TP?: BoolFilter<"domains"> | boolean
    MT?: BoolFilter<"domains"> | boolean
    AR?: BoolFilter<"domains"> | boolean
    U?: BoolFilter<"domains"> | boolean
    MDL?: BoolFilter<"domains"> | boolean
    RA?: BoolFilter<"domains"> | boolean
    RoTech?: BoolFilter<"domains"> | boolean
    LS?: BoolFilter<"domains"> | boolean
    RoThink?: BoolFilter<"domains"> | boolean
    EoST?: BoolFilter<"domains"> | boolean
    EF?: BoolFilter<"domains"> | boolean
    RTE?: BoolFilter<"domains"> | boolean
    DLoI?: BoolFilter<"domains"> | boolean
    RaAoC?: BoolFilter<"domains"> | boolean
  }, "id">

  export type domainsOrderByWithAggregationInput = {
    id?: SortOrder
    R?: SortOrder
    TP?: SortOrder
    MT?: SortOrder
    AR?: SortOrder
    U?: SortOrder
    MDL?: SortOrder
    RA?: SortOrder
    RoTech?: SortOrder
    LS?: SortOrder
    RoThink?: SortOrder
    EoST?: SortOrder
    EF?: SortOrder
    RTE?: SortOrder
    DLoI?: SortOrder
    RaAoC?: SortOrder
    _count?: domainsCountOrderByAggregateInput
    _avg?: domainsAvgOrderByAggregateInput
    _max?: domainsMaxOrderByAggregateInput
    _min?: domainsMinOrderByAggregateInput
    _sum?: domainsSumOrderByAggregateInput
  }

  export type domainsScalarWhereWithAggregatesInput = {
    AND?: domainsScalarWhereWithAggregatesInput | domainsScalarWhereWithAggregatesInput[]
    OR?: domainsScalarWhereWithAggregatesInput[]
    NOT?: domainsScalarWhereWithAggregatesInput | domainsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"domains"> | number
    R?: BoolWithAggregatesFilter<"domains"> | boolean
    TP?: BoolWithAggregatesFilter<"domains"> | boolean
    MT?: BoolWithAggregatesFilter<"domains"> | boolean
    AR?: BoolWithAggregatesFilter<"domains"> | boolean
    U?: BoolWithAggregatesFilter<"domains"> | boolean
    MDL?: BoolWithAggregatesFilter<"domains"> | boolean
    RA?: BoolWithAggregatesFilter<"domains"> | boolean
    RoTech?: BoolWithAggregatesFilter<"domains"> | boolean
    LS?: BoolWithAggregatesFilter<"domains"> | boolean
    RoThink?: BoolWithAggregatesFilter<"domains"> | boolean
    EoST?: BoolWithAggregatesFilter<"domains"> | boolean
    EF?: BoolWithAggregatesFilter<"domains"> | boolean
    RTE?: BoolWithAggregatesFilter<"domains"> | boolean
    DLoI?: BoolWithAggregatesFilter<"domains"> | boolean
    RaAoC?: BoolWithAggregatesFilter<"domains"> | boolean
  }

  export type loginWhereInput = {
    AND?: loginWhereInput | loginWhereInput[]
    OR?: loginWhereInput[]
    NOT?: loginWhereInput | loginWhereInput[]
    User?: StringFilter<"login"> | string
    PW?: StringFilter<"login"> | string
  }

  export type loginOrderByWithRelationInput = {
    User?: SortOrder
    PW?: SortOrder
    _relevance?: loginOrderByRelevanceInput
  }

  export type loginWhereUniqueInput = Prisma.AtLeast<{
    User?: string
    AND?: loginWhereInput | loginWhereInput[]
    OR?: loginWhereInput[]
    NOT?: loginWhereInput | loginWhereInput[]
    PW?: StringFilter<"login"> | string
  }, "User">

  export type loginOrderByWithAggregationInput = {
    User?: SortOrder
    PW?: SortOrder
    _count?: loginCountOrderByAggregateInput
    _max?: loginMaxOrderByAggregateInput
    _min?: loginMinOrderByAggregateInput
  }

  export type loginScalarWhereWithAggregatesInput = {
    AND?: loginScalarWhereWithAggregatesInput | loginScalarWhereWithAggregatesInput[]
    OR?: loginScalarWhereWithAggregatesInput[]
    NOT?: loginScalarWhereWithAggregatesInput | loginScalarWhereWithAggregatesInput[]
    User?: StringWithAggregatesFilter<"login"> | string
    PW?: StringWithAggregatesFilter<"login"> | string
  }

  export type submissionCreateInput = {
    id: number
    techname: string
    tl1_desc: string
    tl2_desc: string
    tl3_desc: string
    tl4_desc: string
    link: string
    displaytext: string
    accepted: boolean
    username: string
    contact: string
  }

  export type submissionUncheckedCreateInput = {
    id: number
    techname: string
    tl1_desc: string
    tl2_desc: string
    tl3_desc: string
    tl4_desc: string
    link: string
    displaytext: string
    accepted: boolean
    username: string
    contact: string
  }

  export type submissionUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    techname?: StringFieldUpdateOperationsInput | string
    tl1_desc?: StringFieldUpdateOperationsInput | string
    tl2_desc?: StringFieldUpdateOperationsInput | string
    tl3_desc?: StringFieldUpdateOperationsInput | string
    tl4_desc?: StringFieldUpdateOperationsInput | string
    link?: StringFieldUpdateOperationsInput | string
    displaytext?: StringFieldUpdateOperationsInput | string
    accepted?: BoolFieldUpdateOperationsInput | boolean
    username?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
  }

  export type submissionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    techname?: StringFieldUpdateOperationsInput | string
    tl1_desc?: StringFieldUpdateOperationsInput | string
    tl2_desc?: StringFieldUpdateOperationsInput | string
    tl3_desc?: StringFieldUpdateOperationsInput | string
    tl4_desc?: StringFieldUpdateOperationsInput | string
    link?: StringFieldUpdateOperationsInput | string
    displaytext?: StringFieldUpdateOperationsInput | string
    accepted?: BoolFieldUpdateOperationsInput | boolean
    username?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
  }

  export type submissionCreateManyInput = {
    id: number
    techname: string
    tl1_desc: string
    tl2_desc: string
    tl3_desc: string
    tl4_desc: string
    link: string
    displaytext: string
    accepted: boolean
    username: string
    contact: string
  }

  export type submissionUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    techname?: StringFieldUpdateOperationsInput | string
    tl1_desc?: StringFieldUpdateOperationsInput | string
    tl2_desc?: StringFieldUpdateOperationsInput | string
    tl3_desc?: StringFieldUpdateOperationsInput | string
    tl4_desc?: StringFieldUpdateOperationsInput | string
    link?: StringFieldUpdateOperationsInput | string
    displaytext?: StringFieldUpdateOperationsInput | string
    accepted?: BoolFieldUpdateOperationsInput | boolean
    username?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
  }

  export type submissionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    techname?: StringFieldUpdateOperationsInput | string
    tl1_desc?: StringFieldUpdateOperationsInput | string
    tl2_desc?: StringFieldUpdateOperationsInput | string
    tl3_desc?: StringFieldUpdateOperationsInput | string
    tl4_desc?: StringFieldUpdateOperationsInput | string
    link?: StringFieldUpdateOperationsInput | string
    displaytext?: StringFieldUpdateOperationsInput | string
    accepted?: BoolFieldUpdateOperationsInput | boolean
    username?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
  }

  export type domainsCreateInput = {
    id: number
    R: boolean
    TP: boolean
    MT: boolean
    AR: boolean
    U: boolean
    MDL: boolean
    RA: boolean
    RoTech: boolean
    LS: boolean
    RoThink: boolean
    EoST: boolean
    EF: boolean
    RTE: boolean
    DLoI: boolean
    RaAoC: boolean
  }

  export type domainsUncheckedCreateInput = {
    id: number
    R: boolean
    TP: boolean
    MT: boolean
    AR: boolean
    U: boolean
    MDL: boolean
    RA: boolean
    RoTech: boolean
    LS: boolean
    RoThink: boolean
    EoST: boolean
    EF: boolean
    RTE: boolean
    DLoI: boolean
    RaAoC: boolean
  }

  export type domainsUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    R?: BoolFieldUpdateOperationsInput | boolean
    TP?: BoolFieldUpdateOperationsInput | boolean
    MT?: BoolFieldUpdateOperationsInput | boolean
    AR?: BoolFieldUpdateOperationsInput | boolean
    U?: BoolFieldUpdateOperationsInput | boolean
    MDL?: BoolFieldUpdateOperationsInput | boolean
    RA?: BoolFieldUpdateOperationsInput | boolean
    RoTech?: BoolFieldUpdateOperationsInput | boolean
    LS?: BoolFieldUpdateOperationsInput | boolean
    RoThink?: BoolFieldUpdateOperationsInput | boolean
    EoST?: BoolFieldUpdateOperationsInput | boolean
    EF?: BoolFieldUpdateOperationsInput | boolean
    RTE?: BoolFieldUpdateOperationsInput | boolean
    DLoI?: BoolFieldUpdateOperationsInput | boolean
    RaAoC?: BoolFieldUpdateOperationsInput | boolean
  }

  export type domainsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    R?: BoolFieldUpdateOperationsInput | boolean
    TP?: BoolFieldUpdateOperationsInput | boolean
    MT?: BoolFieldUpdateOperationsInput | boolean
    AR?: BoolFieldUpdateOperationsInput | boolean
    U?: BoolFieldUpdateOperationsInput | boolean
    MDL?: BoolFieldUpdateOperationsInput | boolean
    RA?: BoolFieldUpdateOperationsInput | boolean
    RoTech?: BoolFieldUpdateOperationsInput | boolean
    LS?: BoolFieldUpdateOperationsInput | boolean
    RoThink?: BoolFieldUpdateOperationsInput | boolean
    EoST?: BoolFieldUpdateOperationsInput | boolean
    EF?: BoolFieldUpdateOperationsInput | boolean
    RTE?: BoolFieldUpdateOperationsInput | boolean
    DLoI?: BoolFieldUpdateOperationsInput | boolean
    RaAoC?: BoolFieldUpdateOperationsInput | boolean
  }

  export type domainsCreateManyInput = {
    id: number
    R: boolean
    TP: boolean
    MT: boolean
    AR: boolean
    U: boolean
    MDL: boolean
    RA: boolean
    RoTech: boolean
    LS: boolean
    RoThink: boolean
    EoST: boolean
    EF: boolean
    RTE: boolean
    DLoI: boolean
    RaAoC: boolean
  }

  export type domainsUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    R?: BoolFieldUpdateOperationsInput | boolean
    TP?: BoolFieldUpdateOperationsInput | boolean
    MT?: BoolFieldUpdateOperationsInput | boolean
    AR?: BoolFieldUpdateOperationsInput | boolean
    U?: BoolFieldUpdateOperationsInput | boolean
    MDL?: BoolFieldUpdateOperationsInput | boolean
    RA?: BoolFieldUpdateOperationsInput | boolean
    RoTech?: BoolFieldUpdateOperationsInput | boolean
    LS?: BoolFieldUpdateOperationsInput | boolean
    RoThink?: BoolFieldUpdateOperationsInput | boolean
    EoST?: BoolFieldUpdateOperationsInput | boolean
    EF?: BoolFieldUpdateOperationsInput | boolean
    RTE?: BoolFieldUpdateOperationsInput | boolean
    DLoI?: BoolFieldUpdateOperationsInput | boolean
    RaAoC?: BoolFieldUpdateOperationsInput | boolean
  }

  export type domainsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    R?: BoolFieldUpdateOperationsInput | boolean
    TP?: BoolFieldUpdateOperationsInput | boolean
    MT?: BoolFieldUpdateOperationsInput | boolean
    AR?: BoolFieldUpdateOperationsInput | boolean
    U?: BoolFieldUpdateOperationsInput | boolean
    MDL?: BoolFieldUpdateOperationsInput | boolean
    RA?: BoolFieldUpdateOperationsInput | boolean
    RoTech?: BoolFieldUpdateOperationsInput | boolean
    LS?: BoolFieldUpdateOperationsInput | boolean
    RoThink?: BoolFieldUpdateOperationsInput | boolean
    EoST?: BoolFieldUpdateOperationsInput | boolean
    EF?: BoolFieldUpdateOperationsInput | boolean
    RTE?: BoolFieldUpdateOperationsInput | boolean
    DLoI?: BoolFieldUpdateOperationsInput | boolean
    RaAoC?: BoolFieldUpdateOperationsInput | boolean
  }

  export type loginCreateInput = {
    User: string
    PW: string
  }

  export type loginUncheckedCreateInput = {
    User: string
    PW: string
  }

  export type loginUpdateInput = {
    User?: StringFieldUpdateOperationsInput | string
    PW?: StringFieldUpdateOperationsInput | string
  }

  export type loginUncheckedUpdateInput = {
    User?: StringFieldUpdateOperationsInput | string
    PW?: StringFieldUpdateOperationsInput | string
  }

  export type loginCreateManyInput = {
    User: string
    PW: string
  }

  export type loginUpdateManyMutationInput = {
    User?: StringFieldUpdateOperationsInput | string
    PW?: StringFieldUpdateOperationsInput | string
  }

  export type loginUncheckedUpdateManyInput = {
    User?: StringFieldUpdateOperationsInput | string
    PW?: StringFieldUpdateOperationsInput | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type submissionOrderByRelevanceInput = {
    fields: submissionOrderByRelevanceFieldEnum | submissionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type submissionCountOrderByAggregateInput = {
    id?: SortOrder
    techname?: SortOrder
    tl1_desc?: SortOrder
    tl2_desc?: SortOrder
    tl3_desc?: SortOrder
    tl4_desc?: SortOrder
    link?: SortOrder
    displaytext?: SortOrder
    accepted?: SortOrder
    username?: SortOrder
    contact?: SortOrder
  }

  export type submissionAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type submissionMaxOrderByAggregateInput = {
    id?: SortOrder
    techname?: SortOrder
    tl1_desc?: SortOrder
    tl2_desc?: SortOrder
    tl3_desc?: SortOrder
    tl4_desc?: SortOrder
    link?: SortOrder
    displaytext?: SortOrder
    accepted?: SortOrder
    username?: SortOrder
    contact?: SortOrder
  }

  export type submissionMinOrderByAggregateInput = {
    id?: SortOrder
    techname?: SortOrder
    tl1_desc?: SortOrder
    tl2_desc?: SortOrder
    tl3_desc?: SortOrder
    tl4_desc?: SortOrder
    link?: SortOrder
    displaytext?: SortOrder
    accepted?: SortOrder
    username?: SortOrder
    contact?: SortOrder
  }

  export type submissionSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type domainsCountOrderByAggregateInput = {
    id?: SortOrder
    R?: SortOrder
    TP?: SortOrder
    MT?: SortOrder
    AR?: SortOrder
    U?: SortOrder
    MDL?: SortOrder
    RA?: SortOrder
    RoTech?: SortOrder
    LS?: SortOrder
    RoThink?: SortOrder
    EoST?: SortOrder
    EF?: SortOrder
    RTE?: SortOrder
    DLoI?: SortOrder
    RaAoC?: SortOrder
  }

  export type domainsAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type domainsMaxOrderByAggregateInput = {
    id?: SortOrder
    R?: SortOrder
    TP?: SortOrder
    MT?: SortOrder
    AR?: SortOrder
    U?: SortOrder
    MDL?: SortOrder
    RA?: SortOrder
    RoTech?: SortOrder
    LS?: SortOrder
    RoThink?: SortOrder
    EoST?: SortOrder
    EF?: SortOrder
    RTE?: SortOrder
    DLoI?: SortOrder
    RaAoC?: SortOrder
  }

  export type domainsMinOrderByAggregateInput = {
    id?: SortOrder
    R?: SortOrder
    TP?: SortOrder
    MT?: SortOrder
    AR?: SortOrder
    U?: SortOrder
    MDL?: SortOrder
    RA?: SortOrder
    RoTech?: SortOrder
    LS?: SortOrder
    RoThink?: SortOrder
    EoST?: SortOrder
    EF?: SortOrder
    RTE?: SortOrder
    DLoI?: SortOrder
    RaAoC?: SortOrder
  }

  export type domainsSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type loginOrderByRelevanceInput = {
    fields: loginOrderByRelevanceFieldEnum | loginOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type loginCountOrderByAggregateInput = {
    User?: SortOrder
    PW?: SortOrder
  }

  export type loginMaxOrderByAggregateInput = {
    User?: SortOrder
    PW?: SortOrder
  }

  export type loginMinOrderByAggregateInput = {
    User?: SortOrder
    PW?: SortOrder
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}