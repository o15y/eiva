/// <reference types="express" />
/// <reference types="stripe/types/shared" />
/// <reference types="stripe/types/Errors" />
/// <reference types="stripe/types/OAuth" />
/// <reference types="stripe/types/Webhooks" />
/// <reference types="stripe/types/2020-03-02/AccountLinks" />
/// <reference types="stripe/types/2020-03-02/Accounts" />
/// <reference types="stripe/types/2020-03-02/AlipayAccounts" />
/// <reference types="stripe/types/2020-03-02/ApplePayDomains" />
/// <reference types="stripe/types/2020-03-02/ApplicationFees" />
/// <reference types="stripe/types/2020-03-02/Applications" />
/// <reference types="stripe/types/2020-03-02/Balance" />
/// <reference types="stripe/types/2020-03-02/BalanceTransactions" />
/// <reference types="stripe/types/2020-03-02/BankAccounts" />
/// <reference types="stripe/types/2020-03-02/BillingPortal/Sessions" />
/// <reference types="stripe/types/2020-03-02/BitcoinReceivers" />
/// <reference types="stripe/types/2020-03-02/BitcoinTransactions" />
/// <reference types="stripe/types/2020-03-02/Capabilities" />
/// <reference types="stripe/types/2020-03-02/Cards" />
/// <reference types="stripe/types/2020-03-02/Charges" />
/// <reference types="stripe/types/2020-03-02/Checkout/Sessions" />
/// <reference types="stripe/types/2020-03-02/ConnectCollectionTransfers" />
/// <reference types="stripe/types/2020-03-02/CountrySpecs" />
/// <reference types="stripe/types/2020-03-02/Coupons" />
/// <reference types="stripe/types/2020-03-02/CreditNoteLineItems" />
/// <reference types="stripe/types/2020-03-02/CreditNotes" />
/// <reference types="stripe/types/2020-03-02/CustomerBalanceTransactions" />
/// <reference types="stripe/types/2020-03-02/CustomerSources" />
/// <reference types="stripe/types/2020-03-02/Customers" />
/// <reference types="stripe/types/2020-03-02/Discounts" />
/// <reference types="stripe/types/2020-03-02/Disputes" />
/// <reference types="stripe/types/2020-03-02/EphemeralKeys" />
/// <reference types="stripe/types/2020-03-02/Events" />
/// <reference types="stripe/types/2020-03-02/ExchangeRates" />
/// <reference types="stripe/types/2020-03-02/ExternalAccounts" />
/// <reference types="stripe/types/2020-03-02/FeeRefunds" />
/// <reference types="stripe/types/2020-03-02/FileLinks" />
/// <reference types="stripe/types/2020-03-02/Files" />
/// <reference types="stripe/types/2020-03-02/InvoiceItems" />
/// <reference types="stripe/types/2020-03-02/InvoiceLineItems" />
/// <reference types="stripe/types/2020-03-02/Invoices" />
/// <reference types="stripe/types/2020-03-02/IssuerFraudRecords" />
/// <reference types="stripe/types/2020-03-02/Issuing/Authorizations" />
/// <reference types="stripe/types/2020-03-02/Issuing/CardDetails" />
/// <reference types="stripe/types/2020-03-02/Issuing/Cardholders" />
/// <reference types="stripe/types/2020-03-02/Issuing/Cards" />
/// <reference types="stripe/types/2020-03-02/Issuing/Disputes" />
/// <reference types="stripe/types/2020-03-02/Issuing/Transactions" />
/// <reference types="stripe/types/2020-03-02/LoginLinks" />
/// <reference types="stripe/types/2020-03-02/Mandates" />
/// <reference types="stripe/types/2020-03-02/OrderItems" />
/// <reference types="stripe/types/2020-03-02/OrderReturns" />
/// <reference types="stripe/types/2020-03-02/Orders" />
/// <reference types="stripe/types/2020-03-02/PaymentIntents" />
/// <reference types="stripe/types/2020-03-02/PaymentMethods" />
/// <reference types="stripe/types/2020-03-02/Payouts" />
/// <reference types="stripe/types/2020-03-02/Persons" />
/// <reference types="stripe/types/2020-03-02/Plans" />
/// <reference types="stripe/types/2020-03-02/PlatformTaxFees" />
/// <reference types="stripe/types/2020-03-02/Prices" />
/// <reference types="stripe/types/2020-03-02/Products" />
/// <reference types="stripe/types/2020-03-02/Radar/EarlyFraudWarnings" />
/// <reference types="stripe/types/2020-03-02/Radar/ValueListItems" />
/// <reference types="stripe/types/2020-03-02/Radar/ValueLists" />
/// <reference types="stripe/types/2020-03-02/Recipients" />
/// <reference types="stripe/types/2020-03-02/Refunds" />
/// <reference types="stripe/types/2020-03-02/Reporting/ReportRuns" />
/// <reference types="stripe/types/2020-03-02/Reporting/ReportTypes" />
/// <reference types="stripe/types/2020-03-02/ReserveTransactions" />
/// <reference types="stripe/types/2020-03-02/Reviews" />
/// <reference types="stripe/types/2020-03-02/SKUs" />
/// <reference types="stripe/types/2020-03-02/SetupIntents" />
/// <reference types="stripe/types/2020-03-02/Sigma/ScheduledQueryRuns" />
/// <reference types="stripe/types/2020-03-02/SourceMandateNotifications" />
/// <reference types="stripe/types/2020-03-02/SourceTransactions" />
/// <reference types="stripe/types/2020-03-02/Sources" />
/// <reference types="stripe/types/2020-03-02/SubscriptionItems" />
/// <reference types="stripe/types/2020-03-02/SubscriptionSchedules" />
/// <reference types="stripe/types/2020-03-02/Subscriptions" />
/// <reference types="stripe/types/2020-03-02/TaxDeductedAtSources" />
/// <reference types="stripe/types/2020-03-02/TaxIds" />
/// <reference types="stripe/types/2020-03-02/TaxRates" />
/// <reference types="stripe/types/2020-03-02/Terminal/ConnectionTokens" />
/// <reference types="stripe/types/2020-03-02/Terminal/Locations" />
/// <reference types="stripe/types/2020-03-02/Terminal/Readers" />
/// <reference types="stripe/types/2020-03-02/Tokens" />
/// <reference types="stripe/types/2020-03-02/Topups" />
/// <reference types="stripe/types/2020-03-02/TransferReversals" />
/// <reference types="stripe/types/2020-03-02/Transfers" />
/// <reference types="stripe/types/2020-03-02/UsageRecordSummaries" />
/// <reference types="stripe/types/2020-03-02/UsageRecords" />
/// <reference types="stripe/types/2020-03-02/WebhookEndpoints" />
/// <reference types="stripe" />
/// <reference types="stripe/types/lib" />
import { Request, Response } from "@staart/server";
export declare class OrganizationController {
    get(req: Request, res: Response): Promise<import(".prisma/client").organizations>;
    patch(req: Request, res: Response): Promise<{
        updated: import(".prisma/client").organizations;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    delete(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    getData(req: Request, res: Response): Promise<{
        billing: import("stripe").Stripe.Customer | import("stripe").Stripe.DeletedCustomer;
        subscriptions: any;
        invoices: any;
        sources: any;
        autoJoinDomain: boolean;
        createdAt: Date;
        forceTwoFactor: boolean;
        id: number;
        ipRestrictions: string | null;
        name: string;
        onlyAllowDomain: boolean;
        profilePicture: string;
        stripeCustomerId: string | null;
        updatedAt: Date;
        username: string;
        assistantName: string;
        assistantSignature: string;
        schedulingDays: string;
        schedulingTimeStart: string;
        schedulingTimeEnd: string;
        schedulingPadding: number;
        schedulingDuration: number;
        schedulingType: "IN_PERSON" | "PHONE_CALL" | "VIDEO_CALL";
        schedulingLocation: number;
        calendars: string | null;
        customEmailEnabled: boolean;
        customEmailAddress: string | null;
        customEmailHost: string | null;
        customEmailPort: number | null;
        customEmailSecure: boolean;
        customEmailUsername: string | null;
        customEmailPassword: string | null;
        memberships: import(".prisma/client").memberships[];
        api_keys: import(".prisma/client").api_keys[];
        domains: import(".prisma/client").domains[];
        webhooks: import(".prisma/client").webhooks[];
    } | {
        autoJoinDomain: boolean;
        createdAt: Date;
        forceTwoFactor: boolean;
        id: number;
        ipRestrictions: string | null;
        name: string;
        onlyAllowDomain: boolean;
        profilePicture: string;
        stripeCustomerId: string | null;
        updatedAt: Date;
        username: string;
        assistantName: string;
        assistantSignature: string;
        schedulingDays: string;
        schedulingTimeStart: string;
        schedulingTimeEnd: string;
        schedulingPadding: number;
        schedulingDuration: number;
        schedulingType: "IN_PERSON" | "PHONE_CALL" | "VIDEO_CALL";
        schedulingLocation: number;
        calendars: string | null;
        customEmailEnabled: boolean;
        customEmailAddress: string | null;
        customEmailHost: string | null;
        customEmailPort: number | null;
        customEmailSecure: boolean;
        customEmailUsername: string | null;
        customEmailPassword: string | null;
        memberships: import(".prisma/client").memberships[];
        api_keys: import(".prisma/client").api_keys[];
        domains: import(".prisma/client").domains[];
        webhooks: import(".prisma/client").webhooks[];
    }>;
}
