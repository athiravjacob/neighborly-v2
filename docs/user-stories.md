# User Stories

## Seeker Stories

|#|User Story|
|---|---|
|1|As a seeker, I want to register and log in using email/password or Google OAuth so that I can start booking quickly.|
|2|As a seeker, I want to set my location (auto-detect or map picker) and browse services (category, subcategory, variant) with fixed prices so that I know exactly what I'm paying.|
|3|As a seeker, I want to add a description about the task (e.g., "extra dirty kitchen") so that the helper knows special requirements.|
|4|As a seeker, I want to search for available helpers on a specific date or any day within the next 7 days so that I can find someone who matches my schedule.|
|5|As a seeker, I want to see a list of nearby verified helpers with distance, number of tasks completed, verification status, and availability so that I can choose the best one.|
|6|As a seeker, I want to send a booking request to a chosen helper (no payment yet) so that the helper can accept or reject it.|
|7|As a seeker, I want to be notified when the helper accepts or rejects my request so that I know the status immediately.|
|8|As a seeker, if the helper accepts, I want to pay the full amount (or deposit) to confirm the booking so that the slot is secured.|
|9|As a seeker, I want to cancel my booking request before the helper accepts (or if rejected) and get a full instant refund so that I'm not charged for changes.|
|10|As a seeker, after the job is done, I want to mark "Satisfied – Great work" (money released to helper) or "Not satisfied" (full refund + dispute raised) so that I'm protected.|
|11|As a seeker, I want to chat with the helper during the booking so that we can coordinate easily.|
|12|As a seeker, I want to view my wallet and transaction history (good to have) so that I can track my spending and payments.|

```mermaid
flowchart TD
    Start([Seeker Starts]) --> Register[Register/Login<br/>Email or Google OAuth]
    Register --> SetLocation[Set Location<br/>Auto-detect or Map Picker]
    SetLocation --> BrowseServices[Browse Services<br/>Category, Subcategory, Variant<br/>View Fixed Prices]
    BrowseServices --> AddDescription[Add Task Description<br/>e.g., Extra dirty kitchen]
    AddDescription --> SearchHelper[Search for Helpers<br/>Specific Date or Next 7 Days]
    SearchHelper --> ViewHelpers[View Available Helpers<br/>Distance, Tasks Completed,<br/>Verification Status]
    ViewHelpers --> SelectHelper{Select Helper}
    SelectHelper --> SendRequest[Send Booking Request<br/>No Payment Yet]
    SendRequest --> WaitResponse[Wait for Helper Response<br/>Chat Available]
    
    WaitResponse --> HelperDecision{Helper Response}
    HelperDecision -->|Rejected| Cancel1[Request Cancelled<br/>No Charge]
    HelperDecision -->|Accepted| Payment[Pay Full Amount<br/>Booking Confirmed]
    
    Cancel1 --> SearchHelper
    
    WaitResponse -->|Before Accept| CancelRequest[Cancel Request]
    CancelRequest --> SearchHelper
    
    Payment --> JobScheduled[Job Scheduled<br/>Chat with Helper]
    JobScheduled --> JobComplete[Helper Completes Job]
    
    JobComplete --> Satisfaction{Mark Satisfaction}
    Satisfaction -->|Satisfied - Great Work| ReleasePayment[Money Released to Helper]
    Satisfaction -->|Not Satisfied| Dispute[Full Refund<br/>Dispute Raised]
    
    ReleasePayment --> ViewWallet[View Wallet &<br/>Transaction History]
    Dispute --> ViewWallet
    
    ViewWallet --> End([End])

    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style Payment fill:#fff4e1
    style Dispute fill:#ffe1e1
    style ReleasePayment fill:#e1f5e1
```


## Helper Stories

| #   | User Story                                                                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | As a helper, I want to register and log in (email or Google) so that I can offer my services.                                                          |
| 2   | As a helper, I want to set my location, working radius, and which cleaning services I offer (General/Deep + BHK variants) so that seekers can find me. |
| 3   | As a helper, I want to set my weekly recurring availability (multiple time windows per day) and block specific dates so that I control my schedule.    |
| 4   | As a helper, I want to see a list of incoming booking requests with details (seeker, service, date, price) so that I can decide which jobs to take.    |
| 5   | As a helper, I want to accept or reject requests within 24 hours so that I only take jobs I want.                                                      |
| 6   | As a helper, I want to mark when I start and complete a job so that the seeker knows the status.                                                       |
| 7   | As a helper, I want to chat with the seeker so that we can coordinate easily.                                                                          |
| 8   | As a helper, I want to receive payment in my wallet only after the seeker marks "Satisfied" so that I'm paid fairly for good work.                     |
|     |                                                                                                                                                        |

```mermaid

flowchart TD
    Start([Helper Starts]) --> Register[Register/Login<br/>Email or Google OAuth]
    Register --> SetProfile[Set Profile<br/>Location & Working Radius]
    SetProfile --> SelectServices[Select Services to Offer<br/>General/Deep Cleaning<br/>BHK Variants]
    SelectServices --> SetAvailability[Set Weekly Availability<br/>Multiple Time Windows<br/>per Day]
    SetAvailability --> BlockDates[Block Specific Dates<br/>Control Schedule]
    
    BlockDates --> WaitRequests[Wait for Booking Requests]
    WaitRequests --> ReceiveRequest[Receive Booking Request<br/>View Details:<br/>Seeker, Service, Date, Price]
    
    ReceiveRequest --> ChatSeeker[Chat with Seeker<br/>Coordinate Details]
    ChatSeeker --> ReviewRequest{Review Request<br/>Within 24 Hours}
    
    ReviewRequest -->|Reject| RejectRequest[Reject Request<br/>Notify Seeker]
    ReviewRequest -->|Accept| AcceptRequest[Accept Request<br/>Booking Confirmed]
    
    RejectRequest --> WaitRequests
    
    AcceptRequest --> JobScheduled[Job Scheduled<br/>Continue Chat]
    JobScheduled --> StartJob[Mark Job Started]
    StartJob --> PerformWork[Perform Cleaning Service]
    PerformWork --> CompleteJob[Mark Job Completed]
    
    CompleteJob --> WaitFeedback[Wait for Seeker<br/>Satisfaction Status]
    
    WaitFeedback --> SeekerDecision{Seeker Decision}
    SeekerDecision -->|Satisfied - Great Work| ReceivePayment[Payment Released<br/>Money in Wallet]
    SeekerDecision -->|Not Satisfied| DisputeRaised[Dispute Raised<br/>Admin Review]
    
    DisputeRaised --> AdminDecision{Admin Decision}
    AdminDecision -->|Approve Helper| ReceivePayment
    AdminDecision -->|Refund Seeker| NoPayment[No Payment<br/>Warning Issued]
    
    ReceivePayment --> ViewWallet[View Wallet<br/>Track Earnings]
    NoPayment --> ViewWallet
    
    ViewWallet --> WaitRequests
    
    style Start fill:#e1f5e1
    style ReceivePayment fill:#e1f5e1
    style DisputeRaised fill:#ffe1e1
    style NoPayment fill:#ffe1e1
    style AcceptRequest fill:#fff4e1
    style RejectRequest fill:#ffcccc
```

## Admin Stories

| #   | User Story                                                                                                                                                             |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | As an admin, I want to log in securely so that I can manage the platform.                                                                                              |
| 2   | As an admin, I want to see a dashboard with total earnings, number of users/helpers, active disputes, and pending verifications so that I can monitor platform health. |
| 3   | As an admin, I want to see all disputes and decide to refund the seeker (and warn helper) or reject the dispute (and pay helper) so that trust is maintained.          |
| 4   | As an admin, I want to automatically suspend users who raise more than 3 false disputes so that bad actors are removed.                                                |
| 5   | As an admin, I want to verify new helpers and edit service prices so that quality and pricing stay consistent.                                                         |
|     |                                                                                                                                                                        |
|     |                                                                                                                                                                        |

```mermaid
flowchart TD
    Start([Admin Starts]) --> Login[Secure Login<br/>Admin Credentials]
    Login --> Dashboard[View Dashboard<br/>Total Earnings<br/>Users/Helpers Count<br/>Active Disputes<br/>Pending Verifications]
    
    Dashboard --> AdminChoice{Select Action}
    
    AdminChoice -->|Manage Disputes| ViewDisputes[View All Disputes<br/>Seeker vs Helper Cases]
    AdminChoice -->|Verify Helpers| ViewVerifications[View Pending<br/>Helper Verifications]
    AdminChoice -->|Manage Pricing| EditPricing[Edit Service Prices<br/>Maintain Consistency]
    AdminChoice -->|Monitor Users| ViewUsers[View User Activity<br/>Check Dispute History]
    
    ViewDisputes --> SelectDispute[Select Dispute Case<br/>Review Details]
    SelectDispute --> ReviewEvidence[Review Evidence<br/>Chat History<br/>Job Details]
    
    ReviewEvidence --> DisputeDecision{Make Decision}
    DisputeDecision -->|Refund Seeker| RefundSeeker[Refund Seeker<br/>Warn Helper<br/>Update Records]
    DisputeDecision -->|Reject Dispute| PayHelper[Pay Helper<br/>Mark Dispute Invalid]
    
    RefundSeeker --> CheckHelperHistory{Check Helper<br/>Warning Count}
    CheckHelperHistory -->|3+ Warnings| SuspendHelper[Suspend Helper<br/>Remove from Platform]
    CheckHelperHistory -->|Less than 3| UpdateWarning[Update Warning Count]
    
    PayHelper --> CheckSeekerHistory{Check Seeker<br/>False Dispute Count}
    CheckSeekerHistory -->|3+ False Disputes| SuspendSeeker[Auto-Suspend Seeker<br/>Remove Bad Actor]
    CheckSeekerHistory -->|Less than 3| UpdateFalseCount[Update False Dispute Count]
    
    SuspendHelper --> Dashboard
    UpdateWarning --> Dashboard
    SuspendSeeker --> Dashboard
    UpdateFalseCount --> Dashboard
    
    ViewVerifications --> ReviewHelper[Review Helper Profile<br/>Documents & Background]
    ReviewHelper --> VerifyDecision{Verify Helper?}
    VerifyDecision -->|Approve| ApproveHelper[Approve Helper<br/>Mark as Verified<br/>Enable for Bookings]
    VerifyDecision -->|Reject| RejectHelper[Reject Helper<br/>Notify & Provide Reason]
    
    ApproveHelper --> Dashboard
    RejectHelper --> Dashboard
    
    EditPricing --> UpdatePrices[Update Service Prices<br/>General/Deep Cleaning<br/>BHK Variants]
    UpdatePrices --> SavePrices[Save & Publish<br/>New Pricing]
    SavePrices --> Dashboard
    
    ViewUsers --> UserAction{User Action Needed?}
    UserAction -->|Suspend User| SuspendUser[Suspend User Account<br/>Document Reason]
    UserAction -->|No Action| Dashboard
    SuspendUser --> Dashboard
    
    Dashboard --> Logout{Logout?}
    Logout -->|Yes| End([End Session])
    Logout -->|No| AdminChoice
    
    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style Dashboard fill:#e1f0ff
    style RefundSeeker fill:#fff4e1
    style PayHelper fill:#e1f5e1
    style SuspendHelper fill:#ffe1e1
    style SuspendSeeker fill:#ffe1e1
    style ApproveHelper fill:#e1f5e1
    style RejectHelper fill:#ffcccc
```


