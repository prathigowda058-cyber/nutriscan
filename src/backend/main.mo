import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";

import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Types
  type UserProfile = {
    name : Text;
    age : Nat;
    weight : Nat;
    height : Nat;
    dietType : Text;
    region : Text;
    language : Text;
  };

  type Vitamins = {
    b12 : Nat;
    vitD : Nat;
    iron : Nat;
    vitC : Nat;
    zinc : Nat;
    calcium : Nat;
  };

  type HealthEntry = {
    timestamp : Int;
    healthScore : Nat;
    vitamins : Vitamins;
    mood : Text;
    notes : Text;
  };

  type AnalysisResult = {
    moduleName : Text;
    findings : [Text];
    deficiencies : [Text];
    confidence : Nat;
    explanation : Text;
    timestamp : Int;
  };

  type MealItem = {
    name : Text;
    kcal : Nat;
    nutrients : Text;
  };

  type DietPlan = {
    date : Int;
    breakfast : [MealItem];
    lunch : [MealItem];
    dinner : [MealItem];
    snacks : [MealItem];
    totalKcal : Nat;
  };

  type SunlightLog = {
    date : Int;
    outdoorMinutes : Nat;
    uvIndex : Nat;
    recommendation : Text;
  };

  type GameStats = {
    healthScore : Nat;
    currentStreak : Nat;
    longestStreak : Nat;
    badges : [Text];
    lastCheckIn : Int;
  };

  type ChatMessage = {
    role : Text;
    content : Text;
    language : Text;
    timestamp : Int;
  };

  type DoctorSuggestion = {
    name : Text;
    specialty : Text;
    location : Text;
    phone : Text;
    available : Bool;
  };

  // Comparison modules
  module HealthEntry {
    public func compareByTimestamp(a : HealthEntry, b : HealthEntry) : Order.Order {
      Int.compare(b.timestamp, a.timestamp); // reverse for getting latest entries first
    };
  };

  // Storage
  let profiles = Map.empty<Principal, UserProfile>();
  let healthEntries = Map.empty<Principal, [HealthEntry]>();
  let analysisResults = Map.empty<Principal, [AnalysisResult]>();
  let dietPlans = Map.empty<Principal, [DietPlan]>();
  let sunlightLogs = Map.empty<Principal, [SunlightLog]>();
  let gameStats = Map.empty<Principal, GameStats>();
  let chatHistory = Map.empty<Principal, [ChatMessage]>();
  let doctorSuggestions = Map.empty<Principal, [DoctorSuggestion]>();
  let dieticianProfiles = Map.empty<Principal, UserProfile>();
  let medicalReports = Map.empty<Text, Storage.ExternalBlob>();

  // Profile Functions
  public shared ({ caller }) func createOrUpdateProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    profiles.add(caller, profile);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public query ({ caller }) func getProfile(user : Principal) : async UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (profiles.get(user)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };

  // Health Entries Functions
  public shared ({ caller }) func addHealthEntry(entry : HealthEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add health entries");
    };
    let entries = switch (healthEntries.get(caller)) {
      case (null) { [] };
      case (?existing) { existing };
    };
    let updated = [entry].concat(entries);
    healthEntries.add(caller, updated);
  };

  public query ({ caller }) func getHealthTimeline() : async [HealthEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view health timeline");
    };
    let entries = switch (healthEntries.get(caller)) {
      case (null) { [] };
      case (?existing) { existing };
    };
    entries.values().take(10).toArray();
  };

  // Analysis Results
  public shared ({ caller }) func saveAnalysisResult(result : AnalysisResult) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save analysis results");
    };
    let results = switch (analysisResults.get(caller)) {
      case (null) { [] };
      case (?existing) { existing };
    };
    let updated = [result].concat(results);
    analysisResults.add(caller, updated);
  };

  public query ({ caller }) func getAnalysisHistory() : async [AnalysisResult] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view analysis history");
    };
    switch (analysisResults.get(caller)) {
      case (null) { [] };
      case (?results) { results };
    };
  };

  // Diet Plan
  public shared ({ caller }) func saveDietPlan(plan : DietPlan) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save diet plans");
    };
    let plans = switch (dietPlans.get(caller)) {
      case (null) { [] };
      case (?existing) { existing };
    };
    let updated = [plan].concat(plans);
    dietPlans.add(caller, updated);
  };

  public query ({ caller }) func getDietPlan(date : Int) : async ?DietPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view diet plans");
    };
    switch (dietPlans.get(caller)) {
      case (null) { null };
      case (?plans) {
        plans.find(
          func(p) {
            p.date == date;
          }
        );
      };
    };
  };

  // Sunlight Log
  public shared ({ caller }) func logSunlight(log : SunlightLog) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log sunlight");
    };
    let logs = switch (sunlightLogs.get(caller)) {
      case (null) { [] };
      case (?existing) { existing };
    };
    let updated = [log].concat(logs);
    sunlightLogs.add(caller, updated);
  };

  public query ({ caller }) func getSunlightHistory() : async [SunlightLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sunlight history");
    };
    switch (sunlightLogs.get(caller)) {
      case (null) { [] };
      case (?logs) { logs };
    };
  };

  // Game Stats
  public shared ({ caller }) func updateGameStats(stats : GameStats) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update game stats");
    };
    gameStats.add(caller, stats);
  };

  public query ({ caller }) func getGameStats() : async ?GameStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view game stats");
    };
    gameStats.get(caller);
  };

  // Chat Messages
  public shared ({ caller }) func addChatMessage(message : ChatMessage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add chat messages");
    };
    let messages = switch (chatHistory.get(caller)) {
      case (null) { [] };
      case (?existing) { existing };
    };
    let updated = [message].concat(messages);
    chatHistory.add(caller, updated);
  };

  public query ({ caller }) func getChatHistory() : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view chat history");
    };
    switch (chatHistory.get(caller)) {
      case (null) { [] };
      case (?messages) { messages };
    };
  };

  // Doctor Suggestions
  public shared ({ caller }) func addDoctorSuggestions(suggestions : [DoctorSuggestion]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add doctor suggestions");
    };
    doctorSuggestions.add(caller, suggestions);
  };

  public query ({ caller }) func getDoctorSuggestions() : async [DoctorSuggestion] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view doctor suggestions");
    };
    switch (doctorSuggestions.get(caller)) {
      case (null) { [] };
      case (?suggestions) { suggestions };
    };
  };
};
