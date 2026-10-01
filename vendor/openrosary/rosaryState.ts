import { getPrayers, getPrayerTitles, getMysteries, getMysteryTypeName, type MysteryType, type Language, type PrayerLanguage } from './prayers';

// Rosary stages
export const STAGE_INTRO = 0;
export const STAGE_FIRST_PRAYERS = 1;
export const STAGE_DECADE = 2;
export const STAGE_CONCLUSION = 3;
export const STAGE_COMPLETE = 4;

export class RosaryState {
    private stage: number;
    private mysteryIndex: number;
    private prayerCount: number;
    private mysteryType: MysteryType;
    private decadeCount: number;
    private complete: boolean;
    private language: Language;
    private prayerLanguage: PrayerLanguage;

    constructor(mysteryType: MysteryType, language: Language = 'en', prayerLanguage: PrayerLanguage = language) {
        this.mysteryType = mysteryType;
        this.language = language;
        this.prayerLanguage = prayerLanguage;
        this.stage = STAGE_INTRO;
        this.mysteryIndex = 0;
        this.prayerCount = 0;
        this.decadeCount = 1;
        this.complete = false;
    }

    // DELIBERATE web-only divergence from Android: Indonesian custom adds an
    // opening Kemuliaan right after the Creed (before Bapa Kami). Orang Indo
    // setelah Aku Percaya emang suka nambahin Kemuliaan. ID rosaries are
    // therefore 81 steps; all other languages stay at 80 like Android.
    private usesIndonesianOpeningGloryBe(): boolean {
        return this.language === 'id';
    }

    private getFirstPrayersMaxIndex(): number {
        return this.usesIndonesianOpeningGloryBe() ? 5 : 4;
    }

    private getFirstPrayersLength(): number {
        return this.getFirstPrayersMaxIndex() + 1;
    }

    getMysteryTypeKey(): MysteryType {
        return this.mysteryType;
    }

    // Set language
    setLanguage(lang: Language) {
        const hadIndonesianOpeningGloryBe = this.usesIndonesianOpeningGloryBe();
        this.language = lang;
        const hasIndonesianOpeningGloryBe = this.usesIndonesianOpeningGloryBe();

        if (this.stage === STAGE_FIRST_PRAYERS && hadIndonesianOpeningGloryBe !== hasIndonesianOpeningGloryBe) {
            if (hasIndonesianOpeningGloryBe) {
                this.prayerCount++;
            } else {
                this.prayerCount = Math.max(0, this.prayerCount - 1);
            }
        }
    }

    getLanguage(): Language {
        return this.language;
    }

    setPrayerLanguage(lang: PrayerLanguage) {
        this.prayerLanguage = lang;
    }

    getPrayerLanguage(): PrayerLanguage {
        return this.prayerLanguage;
    }

    // Advance to the next prayer - only updates state, use getCurrentPrayerText() to get content
    advance(): void {
        if (this.complete) {
            return;
        }

        switch (this.stage) {
            case STAGE_INTRO:
                this.prayerCount++;
                if (this.prayerCount > 1) {
                    this.stage = STAGE_FIRST_PRAYERS;
                    this.prayerCount = 0;
                }
                break;
            case STAGE_FIRST_PRAYERS:
                this.prayerCount++;
                if (this.prayerCount > this.getFirstPrayersMaxIndex()) {
                    this.stage = STAGE_DECADE;
                    this.prayerCount = 0;
                    this.mysteryIndex = 0;
                    this.decadeCount = 1;
                }
                break;
            case STAGE_DECADE:
                this.prayerCount++;
                if (this.prayerCount > 13) {
                    this.mysteryIndex++;
                    this.decadeCount++;
                    if (this.mysteryIndex < 5) {
                        this.prayerCount = 0;
                    } else {
                        this.stage = STAGE_CONCLUSION;
                        this.prayerCount = 0;
                    }
                }
                break;
            case STAGE_CONCLUSION:
                this.prayerCount++;
                if (this.prayerCount > 2) {
                    this.stage = STAGE_COMPLETE;
                    this.complete = true;
                }
                break;
            case STAGE_COMPLETE:
                break;
        }
    }

    // Go back to the previous prayer - only updates state
    goBack(): void {
        switch (this.stage) {
            case STAGE_INTRO:
                if (this.prayerCount > 0) {
                    this.prayerCount--;
                }
                break;
            case STAGE_FIRST_PRAYERS:
                if (this.prayerCount > 0) {
                    this.prayerCount--;
                } else {
                    this.stage = STAGE_INTRO;
                    this.prayerCount = 1;
                }
                break;
            case STAGE_DECADE:
                if (this.prayerCount > 0) {
                    this.prayerCount--;
                } else {
                    if (this.decadeCount > 1) {
                        this.decadeCount--;
                        this.mysteryIndex--;
                        this.prayerCount = 13;
                    } else {
                        this.stage = STAGE_FIRST_PRAYERS;
                        this.prayerCount = this.getFirstPrayersMaxIndex();
                    }
                }
                break;
            case STAGE_CONCLUSION:
                if (this.prayerCount > 0) {
                    this.prayerCount--;
                } else {
                    this.stage = STAGE_DECADE;
                    this.decadeCount = 5;
                    this.mysteryIndex = 4;
                    this.prayerCount = 13;
                }
                break;
            case STAGE_COMPLETE:
                this.stage = STAGE_CONCLUSION;
                this.prayerCount = 2;
                this.complete = false;
                break;
        }
    }

    // Keep this in lockstep with OpenRosary Android's isBeadTypeTransition().
    isBeadTypeTransition(isAdvancing: boolean): boolean {
        const currentStage = this.stage;
        const currentPrayer = this.prayerCount;

        // Mystery transitions do not trigger special vibration.
        if (currentStage === STAGE_DECADE && (currentPrayer === 0 || currentPrayer === 1)) {
            return false;
        }

        if (isAdvancing) {
            if (currentStage === STAGE_DECADE) {
                // From Hail Mary to Glory Be.
                if (currentPrayer === 12) return true;
                // From Our Father to the first Hail Mary.
                if (currentPrayer === 2) return true;
            } else if (currentStage === STAGE_FIRST_PRAYERS && currentPrayer === 5) {
                // From Glory Be in the opening prayers to the decade.
                return true;
            } else if (currentStage === STAGE_INTRO && currentPrayer === 2) {
                // From the Apostles' Creed to the Our Father.
                return true;
            }
        } else {
            if (currentStage === STAGE_DECADE) {
                // From the first Hail Mary back to the Our Father.
                if (currentPrayer === 2) return true;
                // From Glory Be back to the last Hail Mary.
                if (currentPrayer === 12) return true;
            } else if (currentStage === STAGE_DECADE && currentPrayer === 0 && this.mysteryIndex === 0) {
                // From the first decade back to the opening Glory Be.
                return true;
            } else if (currentStage === STAGE_FIRST_PRAYERS && currentPrayer === 0) {
                // From the Our Father back to the Apostles' Creed.
                return true;
            } else if (currentStage === STAGE_CONCLUSION && currentPrayer === 0) {
                // From conclusion prayers back to the last decade.
                return true;
            }
        }

        return false;
    }

    // Get current prayer text - always use this to get prayer content
    getCurrentPrayerText(): string {
        const PRAYERS = getPrayers(this.prayerLanguage);

        switch (this.stage) {
            case STAGE_INTRO:
                if (this.prayerCount === 0) return PRAYERS.signOfCross;
                return PRAYERS.apostlesCreed;

            case STAGE_FIRST_PRAYERS:
                if (this.usesIndonesianOpeningGloryBe()) {
                    if (this.prayerCount === 0) return PRAYERS.gloryBe;
                    if (this.prayerCount === 1) return PRAYERS.ourFather;
                    if (this.prayerCount === 2) return PRAYERS.hailMaryFaith;
                    if (this.prayerCount === 3) return PRAYERS.hailMaryHope;
                    if (this.prayerCount === 4) return PRAYERS.hailMaryCharity;
                    return PRAYERS.gloryBe;
                }
                if (this.prayerCount === 0) return PRAYERS.ourFather;
                if (this.prayerCount === 1) return PRAYERS.hailMaryFaith;
                if (this.prayerCount === 2) return PRAYERS.hailMaryHope;
                if (this.prayerCount === 3) return PRAYERS.hailMaryCharity;
                return PRAYERS.gloryBe;

            case STAGE_DECADE:
                if (this.prayerCount === 0) {
                    const mysteries = getMysteries(this.mysteryType, this.language);
                    const mystery = mysteries[Math.min(this.mysteryIndex, 4)];
                    // The page already shows the mystery and decade as its heading.
                    // Keep the reading pane focused on the scripture itself.
                    return mystery.description;
                }
                if (this.prayerCount === 1) return PRAYERS.ourFather;
                if (this.prayerCount >= 2 && this.prayerCount <= 11) return PRAYERS.hailMary;
                if (this.prayerCount === 12) return PRAYERS.gloryBe;
                return PRAYERS.fatimaPrayer;

            case STAGE_CONCLUSION:
                if (this.prayerCount === 0) return PRAYERS.hailHolyQueen;
                if (this.prayerCount === 1) return PRAYERS.rosaryPrayer;
                return PRAYERS.signOfCross;

            case STAGE_COMPLETE:
            default:
                return this.language === 'id'
                    ? "Rosario Selesai. Tuhan memberkati Anda."
                    : "Rosary Complete. God bless you.";
        }
    }

    // Get current prayer label/title (1:1 from Android: titles follow UI language, not Latin toggle)
    getCurrentPrayerLabel(): string {
        const PRAYER_TITLES = getPrayerTitles(this.language);

        switch (this.stage) {
            case STAGE_INTRO:
                if (this.prayerCount === 0) return PRAYER_TITLES.signOfCross;
                return PRAYER_TITLES.apostlesCreed;

            case STAGE_FIRST_PRAYERS:
                if (this.usesIndonesianOpeningGloryBe()) {
                    if (this.prayerCount === 0) return PRAYER_TITLES.gloryBe;
                    if (this.prayerCount === 1) return PRAYER_TITLES.ourFather;
                    if (this.prayerCount === 2) return PRAYER_TITLES.hailMaryFaith;
                    if (this.prayerCount === 3) return PRAYER_TITLES.hailMaryHope;
                    if (this.prayerCount === 4) return PRAYER_TITLES.hailMaryCharity;
                    return PRAYER_TITLES.gloryBe;
                }
                if (this.prayerCount === 0) return PRAYER_TITLES.ourFather;
                if (this.prayerCount === 1) return PRAYER_TITLES.hailMaryFaith;
                if (this.prayerCount === 2) return PRAYER_TITLES.hailMaryHope;
                if (this.prayerCount === 3) return PRAYER_TITLES.hailMaryCharity;
                return PRAYER_TITLES.gloryBe;

            case STAGE_DECADE:
                if (this.prayerCount === 0) {
                    // 1:1 from Android mystery_label: "Mystery #%d" / "Peristiwa #%d"
                    const label = this.language === 'id' ? 'Peristiwa' : 'Mystery';
                    return `${label} #${this.decadeCount}`;
                }
                if (this.prayerCount === 1) return PRAYER_TITLES.ourFather;
                if (this.prayerCount >= 2 && this.prayerCount <= 11) {
                    const hailMaryNumber = this.prayerCount - 1;
                    return `${PRAYER_TITLES.hailMary} (${hailMaryNumber}/10)`;
                }
                if (this.prayerCount === 12) return PRAYER_TITLES.gloryBe;
                return PRAYER_TITLES.fatimaPrayer;

            case STAGE_CONCLUSION:
                if (this.prayerCount === 0) return PRAYER_TITLES.hailHolyQueen;
                if (this.prayerCount === 1) return PRAYER_TITLES.rosaryPrayer;
                return PRAYER_TITLES.signOfCross;

            case STAGE_COMPLETE:
            default:
                return this.language === 'id' ? "Selesai" : "Complete";
        }
    }

    // Get current mystery title (when in a decade)
    getCurrentMysteryTitle(): string {
        if (this.stage === STAGE_DECADE && this.mysteryIndex < 5) {
            const mysteries = getMysteries(this.mysteryType, this.language);
            return mysteries[this.mysteryIndex].title;
        }
        return "";
    }

    // Get total count (80, or 81 with the deliberate ID opening Kemuliaan)
    getTotalCount(): number {
        let totalCount = 0;

        if (this.stage === STAGE_INTRO) {
            totalCount = this.prayerCount;
        } else if (this.stage > STAGE_INTRO) {
            totalCount = 2;
        }

        if (this.stage === STAGE_FIRST_PRAYERS) {
            totalCount += this.prayerCount;
        } else if (this.stage > STAGE_FIRST_PRAYERS) {
            totalCount += this.getFirstPrayersLength();
        }

        if (this.stage === STAGE_DECADE) {
            totalCount += this.mysteryIndex * 14;
            totalCount += this.prayerCount;
        } else if (this.stage > STAGE_DECADE) {
            totalCount += 5 * 14;
        }

        if (this.stage === STAGE_CONCLUSION) {
            totalCount += this.prayerCount;
        } else if (this.stage === STAGE_COMPLETE) {
            totalCount += 3;
        }

        return totalCount;
    }

    // Get max count (80, or 81 in Indonesian with the deliberate opening Kemuliaan;
    // Android is always 80)
    getMaxCount(): number {
        return 2 + this.getFirstPrayersLength() + (5 * 14) + 3;
    }

    // Check if complete
    isComplete(): boolean {
        return this.complete;
    }

    // Get mystery type
    getMysteryType(): string {
        return getMysteryTypeName(this.mysteryType, this.language);
    }
}
