# Change Request: Modem Placement Assistant



## Change request summary

Telco X wants to add a new feature to help customers improve their home internet experience.

The web app should allow a user to upload:

1. A photo of their modem placed somewhere in the home
2. A photo or image of their home floorplan

The app should then provide simple dynamic tips on where the modem should be placed for better Wi-Fi coverage.

This does not need to use a real AI vision model during the challenge. The team can simulate the AI output using mock logic, sample prompts, rules, or hardcoded responses.



## Business reason

Customers often experience poor Wi-Fi due to modem placement rather than a network fault. Telco X wants to help users self-diagnose common placement issues.

This feature should feel helpful, simple, and customer friendly.

## Scope for this challenge



The team should add a lightweight modem placement assistant to the existing app.

## 

## User story

As a Telco X customer, I want to upload a photo of my modem and a floorplan so that I can receive practical tips on where to place my modem for better Wi-Fi coverage.

## 

## User flow

1. User clicks **Improve your Wi-Fi setup** in the nav
2. User clicks **Check modem placement**.
3. User uploads or selects two images:

   * Modem photo
   * Floorplan image
6. User clicks **Get placement tips**.
7. The app shows practical recommendations.

## 

## Minimum viable feature

The minimum version should include:

* Two upload controls
* Preview of uploaded image names or thumbnails
* A button called **Get placement tips**
* A loading state such as **Analysing your home setup**
* A results section with 3 to 5 placement tips
* A disclaimer that the advice is indicative only
* 

## Suggested dynamic tips

The app should return tips such as:

* Place the modem in a central location where possible.
* Avoid placing the modem inside a cupboard or behind large furniture.
* Keep the modem away from microwaves, thick brick walls, metal cabinets, and large appliances.
* Raise the modem onto a shelf or table rather than placing it on the floor.
* For larger homes, consider a mesh Wi-Fi extender.
* If the floorplan shows multiple levels, consider placing the modem near the centre of the main living level.
* If the modem appears close to an external wall, suggest moving it closer to the centre of the home.

## 

## input options



### Modem photo condition

|Option|Example tip|
|-|-|
|Modem on floor|Raise the modem onto a table or shelf to improve signal spread.|
|Modem in cupboard|Move the modem into an open area. Cupboards can weaken Wi-Fi signal.|
|Modem near kitchen|Keep the modem away from microwaves and large appliances.|
|Modem near window|Move it closer to the centre of the home if possible.|
|Modem in central open area|Current placement looks reasonable. Focus on height and nearby obstructions.|

### 

### Floorplan condition

|Option|Example tip|
|-|-|
|Apartment|Place the modem close to the middle of the apartment, away from bathrooms and utility rooms.|
|Small house|A central hallway or living area may provide better coverage.|
|Large house|Consider a mesh extender if bedrooms are far from the modem.|
|Two storey house|Place the modem near the centre of the level where internet is used most.|
|Long narrow home|Avoid placing the modem at one far end of the home.|

## 

## Output example

After upload, the app could show:

**Your Wi-Fi placement tips**

1. Move the modem closer to the centre of the home where possible.
2. Keep the modem out in the open, not inside a cupboard.
3. Raise the modem onto a shelf or table.
4. Keep it away from large appliances and thick walls.
5. If bedrooms remain weak, consider adding a mesh Wi-Fi extender.

**Confidence:** Medium

**Note:** These tips are indicative only. Actual Wi-Fi performance may depend on walls, building materials, device type, and network conditions.



## Acceptance criteria

The feature is complete if:

* The user can access the modem placement assistant from the app.
* The user can provide or simulate two image uploads.
* The app returns useful placement tips.
* The feature does not break the existing 3 page flow.
* The team can explain whether the AI output is real, mocked, or rule based.
* The team can describe how this could be connected to a real vision model later.





## Privacy note

Because users may upload photos of their home, the interface should include a simple privacy message:

**Privacy note:** Images are used only to generate placement tips in this demo. Do not upload sensitive personal information.



The team should show:

1. The original address search journey.
2. The selected address result page.
3. The modem placement assistant.
4. Two mock uploaded images.
5. The generated placement tips.
6. A brief explanation of how a real AI vision model could replace the mock logic.

