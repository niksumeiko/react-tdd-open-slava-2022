Feature: Make a payment

  I want to make a payment

  @focus
  Scenario: Make a domestic payment
    Given I open a payment page
    When I fill in details for a domestic payment
    And I submit a payment
    And I see successful payment confirmation

