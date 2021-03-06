W5702 
Final Project
Shanzhao Qiao, Yijia Jin

# Are Certain NBA Players Overpaid?

## Introduction

How NBA teams decide the salaries of their players has awakened the curiosity of many scholars. Some investigators suggest that points per game and field goal percentage are the main contributors to players’ salaries (Lyons, Jackson, Livingston, 2015). However, other studies suggest that the common assumption that teams will determine the salary mainly based on offensive performance isn’t accurate. Instead, defensive performances such as rebounds are significant determinants of salary (Huang, 2016). Scholars also state that race is crucial in the determination of salary: U.S.-born African Americans tend to be paid more than U.S.-born Whites, and foreign players from a bigger country tend to be paid higher than those who are from a smaller country(Yang, Chih-Hai, and Hsuan-Yu Lin, 2010). While those experts argue about which factor affects each player’s salary, we believe that each player’s salary is determined by multiple predictors. 

In this project, we will use statistical visualization tools to visualize the correlation between those factors described above as well as the correlation between players' salary and the factors, by which we could recognize potential trends and causual relations within those numbers. After this project, we are expected to identify, with a more comprehensive scope, the factors that are influential in determining players' salary, which will serve as important supporting information for front offices in the NBA. Also, this project can allow fans to challenge or validate their assumptions about a player’s value and have a different perspective in understanding trades and free agency.

## Questions
In this project, we are curious about how NBA teams decide the salaries of their players. Specifically, we raise the following questions to start with:
1. Which factors play the most important role in deciding player salaries. How are they measured in the salary system (performance - more specific metrics left to be explored), age, race, popularity, changing team or not)

2. Among all nba players, which individuals or groups are most overpaid or underpaid?

3. Which team tends to pay high salaries for their players, why? (to retain existing palyers for another term or to hire player from other, etc)

## Data
We retrieved the data on player performance from https://www.basketballreference.com/leagues/NBA_2021_advanced.html and retrieved the salary data from https://www.basketball-reference.com/contracts/players.html. Data from basketballreference.com were retrieved from <i>Sportradar</i>, which is also the official stats partner of the NBA.<i>Sportradar</i> offers various scales of data collection systems, and most of times their data journalists would collect NBA data at a venue or from TV. Those collected data would then be uploaded, processed and distributed using different channels. The race data of players is
collected from https://www.interbasket.net/news/what-percentage-of-nba-players-are-black-howmany-are-white/31018/. 

Note that there is no specific data of each player’s race in authoritative websites, but this link is a blog where the author collect the raw data directly from the NBA  official website, and we scraped the link as our race data. We would double check players’ race as we are combining the two data sets.

The salary would be the dependent variable, while other data, including performance, age, and race would be the independent variables, among which both numerical and categorical variables exist. We could implement the techniques from class to visualize the correlation between independent variables and the dependent variable. There are many associations, correlations, and relationships to be explored in our data. 

## URL
The book can be found at:
https://jyjuni.github.io/5702_nba_salaries/


## Contribution
*This repo was initially generated from a bookdown template available here: https://github.com/jtr13/EDAVtemplate.*	

