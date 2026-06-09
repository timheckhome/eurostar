import { Locator, Page } from "@playwright/test";
import { EventLogger } from "../framework/EventLogger";
import { POBase } from "../framework/POBase";

/**
 * MBT sample payload for this page object:
 * {
 *   fullName: "Ada Lovelace",
 *   emailAddress: "ada@example.com",
 *   emailFrequency: "weekly",
 *   topicInterest: "release notes",
 *   newsletterMessage: "Thanks for joining. Updates will be sent weekly."
 * }
 *
 * Notes:
 * - Keys are matched case-insensitively.
 * - Unknown keys are ignored.
 * - Any subset of supported keys can be provided.
 */
export class NewsletterSignupPage extends POBase {
    private readonly signupNameField: Locator;
    private readonly signupEmailField: Locator;
    private readonly frequencyField: Locator;
    private readonly interestTopicField: Locator;
    private readonly joinNewsletterButton: Locator;
    private readonly backToHomeFromNewsletterLink: Locator;
    private readonly newsletterMessageField: Locator;

    public constructor(page: Page, eventLogger: EventLogger) {
        super(page, eventLogger);

        this.signupNameField = this.page.locator("#signupName");
        this.signupEmailField = this.page.locator("#signupEmail");
        this.frequencyField = this.page.locator("#frequency");
        this.interestTopicField = this.page.locator("#interestTopic");
        this.joinNewsletterButton = this.page.locator("#joinNewsletterButton");
        this.backToHomeFromNewsletterLink = this.page.locator("#backToHomeFromNewsletter");
        this.newsletterMessageField = this.page.locator("#newsletterMessage");
    }

    public async getFullName(): Promise<string> {
        return await this.getElementValue(this.signupNameField);
    }

    public async setFullName(newValue: string): Promise<void> {
        await this.setElementValue(this.signupNameField, newValue, "set Full Name");
    }

    public async validateFullName(
        expectedValue: string,
        exactMatchRequired = false,
    ): Promise<void> {
        await this.validateElementText(
            this.signupNameField,
            expectedValue,
            "validate Full Name",
            exactMatchRequired,
        );
    }

    public async getEmailAddress(): Promise<string> {
        return await this.getElementValue(this.signupEmailField);
    }

    public async setEmailAddress(newValue: string): Promise<void> {
        await this.setElementValue(this.signupEmailField, newValue, "set Email Address");
    }

    public async validateEmailAddress(
        expectedValue: string,
        exactMatchRequired = false,
    ): Promise<void> {
        await this.validateElementText(
            this.signupEmailField,
            expectedValue,
            "validate Email Address",
            exactMatchRequired,
        );
    }

    public async getEmailFrequency(): Promise<string> {
        return await this.getElementValue(this.frequencyField);
    }

    public async setEmailFrequency(newValue: string): Promise<void> {
        await this.setElementValue(this.frequencyField, newValue, "set Email Frequency");
    }

    public async validateEmailFrequency(
        expectedValue: string,
        exactMatchRequired = false,
    ): Promise<void> {
        await this.validateElementText(
            this.frequencyField,
            expectedValue,
            "validate Email Frequency",
            exactMatchRequired,
        );
    }

    public async getTopicInterest(): Promise<string> {
        return await this.getElementValue(this.interestTopicField);
    }

    public async setTopicInterest(newValue: string): Promise<void> {
        await this.setElementValue(this.interestTopicField, newValue, "set Topic Interest");
    }

    public async validateTopicInterest(
        expectedValue: string,
        exactMatchRequired = false,
    ): Promise<void> {
        await this.validateElementText(
            this.interestTopicField,
            expectedValue,
            "validate Topic Interest",
            exactMatchRequired,
        );
    }

    public async getNewsletterMessage(): Promise<string> {
        return await this.getElementValue(this.newsletterMessageField);
    }

    public async validateNewsletterMessage(
        expectedValue: string,
        exactMatchRequired = false,
    ): Promise<void> {
        await this.validateElementText(
            this.newsletterMessageField,
            expectedValue,
            "validate Newsletter Message",
            exactMatchRequired,
        );
    }

    public async clickJoinNewsletterButton(): Promise<void> {
        await this.clickElement(this.joinNewsletterButton, "click Join Newsletter button", "button");
    }

    public async clickBackToHomeFromNewsletterLink(): Promise<void> {
        await this.clickElement(this.backToHomeFromNewsletterLink, "click Back to Home link", "link");
    }

    public async fillForm(data: Record<string, unknown>): Promise<void> {
        if (!data) return;

        for (const [rawKey, value] of Object.entries(data)) {
            const key = rawKey.toLowerCase();
            const handler = this.fillHandlers[key];
            if (!handler) continue;
            await handler(value);
        }
    }

    public async validateForm(expected: Record<string, unknown>): Promise<void> {
        if (!expected) return;

        for (const [rawKey, value] of Object.entries(expected)) {
            const key = rawKey.toLowerCase();
            const validator = this.validateHandlers[key];
            if (!validator) continue;
            await validator(value);
        }
    }

    private readonly fillHandlers: Record<string, (value: unknown) => Promise<void>> = {
        fullname: async (value: unknown) => await this.setFullName(String(value ?? "")),
        emailaddress: async (value: unknown) => await this.setEmailAddress(String(value ?? "")),
        emailfrequency: async (value: unknown) => await this.setEmailFrequency(String(value ?? "")),
        topicinterest: async (value: unknown) => await this.setTopicInterest(String(value ?? "")),
    };

    private readonly validateHandlers: Record<string, (value: unknown) => Promise<void>> = {
        fullname: async (value: unknown) => await this.validateFullName(String(value ?? "")),
        emailaddress: async (value: unknown) => await this.validateEmailAddress(String(value ?? "")),
        emailfrequency: async (value: unknown) => await this.validateEmailFrequency(String(value ?? "")),
        topicinterest: async (value: unknown) => await this.validateTopicInterest(String(value ?? "")),
        newslettermessage: async (value: unknown) =>
            await this.validateNewsletterMessage(String(value ?? "")),
    };
}
