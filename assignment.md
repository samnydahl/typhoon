##Description
The development team is creating a new orders solution for the e-commerce platform. You are tasked with creating the backend infrastructure for registering and saving new orders to AWS. Your solution should include:
    • An interface to post new orders to the cloud.
    • A solution to pre-process the data.
    • A storage solution where the orders are stored and can be retrieved by another interface (developed by your colleague).

##Requirements:
    • The provisioned resources should be deployed using infrastructure as code.
    • The solution should be cost-effective and highly utilized in regards to the provisioned infrastructure.
    • The solution should be able to scale during peak periods with hundreds of new orders per second.
    • The solution should be fault-tolerant

##Data:
All fields provided in input.json are expected to be accepted by the interface but require pre-processing before being stored.
    • productId should be stored in lower case letters
    • price should be converted and stored in NOK
