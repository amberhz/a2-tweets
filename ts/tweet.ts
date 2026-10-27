class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.startsWith("Just completed") ||
            this.text.startsWith("Just posted")) {
            return "completed_event";
        }

        if (this.text.startsWith("Watch my") &&
            this.text.includes("right now")) {
            return "live_event";
        }
        
        if (this.text.startsWith("Achieved") ||
            this.text.startsWith("I just set a goal")) {
            return "achievement";
        }       

        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if (!this.text.includes(" - ")) {
            return false;
        }

        let comment = this.text.split(" - ")[1];
        comment = comment.split("https://")[0];
        comment = comment.replace("#Runkeeper", "").trim();

        return comment.length > 0 &&
            !comment.includes("TomTom MySports Watch");
    }

    get writtenText():string {
        if (!this.written) {
            return "";
        }

        let comment = this.text.slice(this.text.indexOf(" - ") + 3);
        comment = comment.split("https://")[0];
        comment = comment.replace("#Runkeeper", "").trim();

        return comment;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        let activity = this.text
            .replace("Just completed a ", "")
            .replace("Just posted a ", "")
            .replace("Just posted an ", "");

        let words = activity.split(" ");

        if (words[1] === "km" || words[1] === "mi") {
            activity = words.slice(2).join(" ");
        }

        activity = activity.split(" with @Runkeeper")[0]
                        .split(" with Runkeeper")[0]
                        .split(" - ")[0]
                        .split(" in ")[0]
                        .split(" https://")[0]
                        .trim();

        return activity;
    }

    get distance():number {
        if (this.source != 'completed_event') {
            return 0;
        }

        let words = this.text.split(" ");
        let distance = parseFloat(words[3]);
        let unit = words[4];

        if (isNaN(distance) || (unit !== "km" && unit !== "mi")) {
            return 0;
        }

        if (unit === "km") {
            return distance / 1.609;
        }

        return distance;
    }

    getHTMLTableRow(rowNumber:number):string {
        let tweetText = this.text
            .replace(/&amp;/g, "&")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        tweetText = tweetText.replace(
            /(https?:\/\/[^\s<>"']+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );

        return `<tr>
            <td>${rowNumber}</td>
            <td>${this.activityType}</td>
            <td>${tweetText}</td>
        </tr>`;
    }
}