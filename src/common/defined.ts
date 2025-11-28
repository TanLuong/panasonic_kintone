// --- Core Kintone Enums and Utility Types ---
namespace Kintone {
    /**
     * Represents the unique identifier for an entity in Kintone.
     * @see [1] for various entities with IDs (App, Record, Space, User, Department, Group, Plugin).
     */
    export type Id = string;

    /**
     * Represents a URL or URI in Kintone.
     * @see [1] for Get App Icon URLs, Get User Icons, Get URL.
     */
    export type Url = string;

    /**
     * Represents an authentication token used in REST API requests.
     * @see [2] for API token authentication.
     */
    export type ApiToken = string;

    /**
     * Represents various permission scopes for OAuth clients.
     * @see [1] for OAuth Permission Scopes. This would typically be a union of string literals.
     */
    export type OAuthPermissionScope = string; // Placeholder, as specific scopes are not listed.

    /**
     * Represents the general type of a Kintone field.
     * @see [1] for Field Types. This would typically be a union of specific field types (e.g., 'TEXT', 'NUMBER', 'DATE').
     */
    export type KintoneFieldType = string; // Placeholder, as specific field types are not listed.

    /**
     * Represents a query string used for filtering records or lists.
     * @see [1] for Query string, Get Record List Query.
     */
    export type QueryString = string;

    /**
     * General status type.
     * @see [1] for Get App Deploy Status, Update Status, Record Status History.
     */
    export type Status = string;

    /**
     * Represents a Kintone comment.
     * @see [1] for Get Comments, Add Comment, Delete Comment, Add Thread Comment.
     */
    export interface Comment {
        id: Id;
        text: string;
        creator: UserInfo;
        createdAt: string; // ISO 8601 date string
        mentions?: UserInfo[];
    }

    /**
     * Represents a Kintone cursor for pagination or bulk operations.
     * @see [1] for Get Cursor, Add Cursor, Delete Cursor.
     */
    export interface Cursor {
        id: Id;
        appId: Id;
        size: number;
        records: rest.Record[];
        next: boolean;
    }

    /**
     * Basic user information.
     * @see [1] for User API Overview, Get Logged-in User, Get User Icons, Get Space Members.
     */
    export interface UserInfo {
        id: Id;
        code: string;
        name: string;
    }
}

// --- REST API Definitions ---
namespace Kintone.rest {
    /**
     * Represents a Kintone App.
     * @see [1] for AppsGet App, Get Apps, Add Preview App, Update App.
     */
    export interface App {
        appId: Id;
        name: string;
        description?: string;
        createdAt?: string;
        updatedAt?: string;
        creator?: UserInfo;
        updater?: UserInfo;
        spaceId?: Id;
        threadId?: Id;
        /** @see [1] for Get App Icon URLs */
        iconUrl?: Url;
        /** @see [1] for Get General Settings, Update General Settings */
        generalSettings?: AppGeneralSettings;
        /** @see [1] for Get Process Management Settings, Update Process Management Settings */
        processManagementSettings?: AppProcessManagementSettings;
        /** @see [1] for Get Customization, Update Customization */
        customization?: AppCustomization;
        /** @see [1] for Get App Permissions, Update App Permissions */
        appPermissions?: AppPermission[];
        /** @see [1] for Get Record Permissions, Update Record Permissions */
        recordPermissions?: RecordPermission[];
        /** @see [1] for Get Field Permissions, Update Field Permissions */
        fieldPermissions?: FieldPermission[];
        /** @see [1] for Get General Notification Settings, Update General Notification Settings */
        generalNotificationSettings?: AppNotificationSettings;
        /** @see [1] for Get Per Record Notification Settings, Update Per Record Notification Settings */
        perRecordNotificationSettings?: AppNotificationSettings;
        /** @see [1] for Get Reminder Notification Settings, Update Reminder Notification Settings */
        reminderNotificationSettings?: AppNotificationSettings;
        /** @see [1] for Get Graph Settings, Update Graph Settings */
        graphSettings?: AppGraphSettings;
        /** @see [1] for Get Action Settings, Update Action Settings */
        actionSettings?: AppActionSettings;
        /** @see [1] for Get Form, Get Form Fields, Get Form Layout */
        form?: {
            fields: Field[];
            layout: FieldLayout[];
        };
        /** @see [1] for Get Views, Update Views */
        views?: AppView[];
        /** @see [1] for Get App Plug-ins, Add Plug-ins */
        plugins?: Plugin[];
        /** @see [1] for Get App Admin Notes, Update App Admin Notes */
        adminNotes?: string;
    }

    /**
     * Represents the data structure for a Kintone record's fields.
     * This is a generic type where keys are field codes and values are field objects.
     * @see [1] for Get Record, Get Records, Add Record, Update Record.
     */
    export interface RecordData {
        [fieldCode: string]: FieldValue;
    }

    /**
     * Represents a single Kintone record.
     * @see [1] for Get Record, Get Records, Add Record, Update Record, Delete Records.
     */
    export interface Record {
        id: Id;
        appId: Id;
        recordNumber: string;
        creator: UserInfo;
        createdAt: string; // ISO 8601 date string
        updater: UserInfo;
        updatedAt: string; // ISO 8601 date string
        status?: Status; // @see [1] for Update Status, Update Statuses
        assignees?: UserInfo[]; // @see [1] for Update Assignees
        data: RecordData;
        comments?: Comment[]; // @see [1] for Get Comments, Add Comment, Delete Comment
    }

    /**
     * Represents a field within a Kintone form.
     * @see [1] for Get Form Fields, Add Form Fields, Update Form Fields, Delete Form Fields.
     */
    export interface Field {
        id?: Id;
        code: string;
        label: string;
        type: KintoneFieldType;
        enabled: boolean;
        required: boolean;
        unique?: boolean;
        lookup?: {
            relatedApp: {
                app: Id;
                field: string;
            };
            relatedKeyField: string;
            // ... other lookup properties
        };
        // ... other type-specific properties (e.g., options for dropdowns, min/max for numbers)
    }

    /**
     * Represents the value of a Kintone field. This is a union of possible field value types.
     */
    export type FieldValue =
        | { value: string | number | boolean | string[] | UserInfo[] | null; } // Text, Number, Checkbox, Radio, Dropdown, User Selection, etc.
        | { fileKeys: string[]; } // File Attachment
        | { value: { value: string; label: string; }[]; } // Multi-choice, etc.
        | { value: Array<RecordData>; }; // Subtable

    /**
     * Represents a Kintone File.
     * @see [1] for Download File, Upload File.
     */
    export interface File {
        fileKey: string;
        name: string;
        size: number;
        contentType: string;
    }

    /**
     * Represents a Kintone Space.
     * @see [1] for Get Space, Add Space, Update Space, Delete Space.
     */
    export interface Space {
        id: Id;
        name: string;
        isPrivate: boolean;
        creator: UserInfo;
        createdAt: string;
        updater: UserInfo;
        updatedAt: string;
        /** @see [1] for Update Space Body */
        body?: string;
        /** @see [1] for Get Space Members, Update Space Members */
        members?: UserInfo[];
        /** @see [1] for Add Guests, Update Guest Members, Delete Guests */
        guests?: UserInfo[];
        /** @see [1] for Add Thread, Update Thread */
        threads?: Thread[];
    }

    /**
     * Represents a Kintone Thread within a Space.
     * @see [1] for Add Thread, Update Thread, Add Thread Comment.
     */
    export interface Thread {
        id: Id;
        spaceId: Id;
        title: string;
        body: string;
        creator: UserInfo;
        createdAt: string;
        updater: UserInfo;
        updatedAt: string;
        comments?: Comment[];
    }

    /**
     * Represents a Kintone Plug-in.
     * @see [1] for Get Installed Plug-ins, Get Required Plug-ins, Install Plug-in, Update Plug-in, Uninstall Plug-in.
     */
    export interface Plugin {
        id: Id;
        name: string;
        version: string;
        description: string;
        installedAppIds?: Id[]; // @see [1] for Get Plug-in Apps
        // ... other plugin-specific properties
    }

    // --- Helper Interfaces for App Settings ---

    /**
     * General settings for an App.
     * @see [1] for Get General Settings.
     */
    export interface AppGeneralSettings {
        name: string;
        description: string;
        icon: string;
        theme: string;
        // ... more general settings
    }

    /**
     * Process management settings for an App.
     * @see [1] for Get Process Management Settings.
     */
    export interface AppProcessManagementSettings {
        enabled: boolean;
        // ... process flow definitions
    }

    /**
     * Customization settings for an App.
     * @see [1] for Get Customization.
     */
    export interface AppCustomization {
        javascriptUrls: Url[];
        cssUrls: Url[];
    }

    /**
     * Notification settings for an App (general, per-record, reminder).
     * @see [1] for Get General Notification Settings, Get Per Record Notification Settings, Get Reminder Notification Settings.
     */
    export interface AppNotificationSettings {
        enabled: boolean;
        recipients: UserInfo[];
        // ... more specific notification rules
    }

    /**
     * Graph settings for an App.
     * @see [1] for Get Graph Settings.
     */
    export interface AppGraphSettings {
        graphs: any[]; // Placeholder, as specific graph structures are not detailed.
    }

    /**
     * Action settings for an App.
     * @see [1] for Get Action Settings.
     */
    export interface AppActionSettings {
        actions: any[]; // Placeholder, as specific action structures are not detailed.
    }

    /**
     * Represents a View in a Kintone App.
     * @see [1] for Get Views.
     */
    export interface AppView {
        id: Id;
        name: string;
        type: 'LIST' | 'CALENDAR' | 'CUSTOM'; // Inferred from common Kintone views.
        filterCond?: QueryString;
        sortCond?: string;
        fields?: string[];
        html?: string; // For Custom Views.
        // ... other view-specific properties
    }

    /**
     * Represents a layout definition for a form.
     * @see [1] for Get Form Layout, Update Form Layout.
     */
    export interface FieldLayout {
        type: 'ROW' | 'GROUP' | 'SPACER';
        fields?: { code: string; size: { width: number; height: number; }; }[];
        // ... layout specific properties
    }

    // --- Permission Interfaces ---

    /**
     * Base interface for permissions.
     */
    export interface Permission {
        entity: {
            type: 'USER' | 'GROUP' | 'ORGANIZATION';
            id: Id;
        };
        permission: 'VIEW' | 'EDIT' | 'DELETE' | 'CREATE' | 'ADMIN'; // Example permissions
        includeSubordinates?: boolean;
    }

    /**
     * App-level permission.
     * @see [1] for Get App Permissions.
     */
    export interface AppPermission extends Permission {
        appId: Id;
    }

    /**
     * Record-level permission.
     * @see [1] for Get Record Permissions.
     */
    export interface RecordPermission extends Permission {
        recordId?: Id; // Can be for specific record or a condition.
        condition?: QueryString;
    }

    /**
     * Field-level permission.
     * @see [1] for Get Field Permissions.
     */
    export interface FieldPermission extends Permission {
        fieldCode: string;
    }
}

// --- Kintone JavaScript API Definitions ---
namespace Kintone.js {
    /**
     * Represents the event object passed to Kintone JavaScript event handlers.
     * @see [1] for Event Handling, Event Object Actions, and various specific events.
     */
    export interface KintoneEvent {
        appId: Id;
        record: rest.RecordData;
        recordId?: Id;
        type: string; // The event type string (e.g., 'app.record.create.show')
        error?: string; // For save error events.
        change?: {
            field: string;
            value: any;
            oldValue: any;
        }; // For field change events.
        status?: Status; // For update status events.
        action?: string; // For action events.
        // ... other event-specific properties
    }

    /**
     * Represents the currently logged-in user.
     * @see [1] for Get Logged-in User.
     */
    export interface LoggedInUser extends UserInfo {
        locale: string;
        timezone: string;
        url: Url;
        departments?: UserDepartment[]; // @see [1] for Get User Departments
        groups?: UserGroup[]; // @see [1] for Get User Groups
        customFields?: { [key: string]: string; }; // @see [1] for Get User Custom Fields
        iconUrl?: Url; // @see [1] for Get User Icons
        systemAdmin?: boolean; // @see [1] for Check User & System Administrator
    }

    /**
     * Represents a Kintone Department associated with a user.
     * @see [1] for Get User Departments.
     */
    export interface UserDepartment {
        id: Id;
        code: string;
        name: string;
        parent: Id | null;
    }

    /**
     * Represents a Kintone Group associated with a user.
     * @see [1] for Get User Groups.
     */
    export interface UserGroup {
        id: Id;
        code: string;
        name: string;
    }

    /**
     * Represents an HTML element corresponding to a Kintone field.
     * @see [1] for Get Record Field Element.
     */
    export interface FieldElement extends HTMLElement {
        // Properties specific to Kintone field elements might be added here.
    }

    /**
     * Represents the status history of a record.
     * @see [1] for Get Record Status History.
     */
    export interface RecordStatusHistory {
        status: Status;
        changedAt: string;
        changer: UserInfo;
    }

    /**
     * Configuration for a Kintone Plug-in.
     * @see [1] for Plug-inGet Config, Set Config.
     */
    export interface PluginConfig {
        [key: string]: string; // Key-value pairs for plugin settings.
    }

    /**
     * Represents available API types.
     * @see [1] for Get Available API Types.
     */
    export type AvailableApiType = 'REST' | 'JS' | 'USER'; // Inferred from API sections.
}

// --- User API Definitions ---
namespace Kintone.user {
    /**
     * Represents a Kintone User, with more detail than `UserInfo`.
     * @see [1] for User API Overview, Get Users, Add Users, Update Users.
     */
    export interface User extends UserInfo {
        locale: string;
        email: string;
        url: Url;
        departments: Kintone.js.UserDepartment[]; // @see [1] for Get User's Departments, Update User's Departments
        groups: Kintone.js.UserGroup[]; // @see [1] for Get User's Groups, Update User's Groups
        services?: UserService[]; // @see [1] for Get User Services, Update User Services
        // ... other user-specific properties like status (active/inactive)
    }

    /**
     * Represents a Kintone Department.
     * @see [1] for Get Departments, Add Departments, Update Departments, Delete Departments.
     */
    export interface Department {
        id: Id;
        code: string;
        name: string;
        parent: Id | null;
        sortOrder: number;
        users?: UserInfo[]; // @see [1] for Get Department's Users
    }

    /**
     * Represents a Kintone Group.
     * @see [1] for Get Groups, Add Groups, Update Groups, Delete Groups.
     */
    export interface Group {
        id: Id;
        code: string;
        name: string;
        sortOrder: number;
        users?: UserInfo[]; // @see [1] for Get Group's Users
    }

    /**
     * Represents a service associated with a Kintone user.
     * @see [1] for Get User Services.
     */
    export interface UserService {
        id: Id;
        code: string;
        name: string;
    }
}
