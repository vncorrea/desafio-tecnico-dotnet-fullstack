using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class Program
{
    private const string ApiBase = "https://jsonmock.hackerrank.com/api/football_matches";
    private static readonly HttpClient HttpClient = CreateHttpClient();

    public static async Task Main()
    {
        string teamName = "Paris Saint-Germain";
        int year = 2013;
        int totalGoals = await getTotalScoredGoals(teamName, year);

        Console.WriteLine("Team " + teamName + " scored " + totalGoals.ToString() + " goals in " + year);

        teamName = "Chelsea";
        year = 2014;
        totalGoals = await getTotalScoredGoals(teamName, year);

        Console.WriteLine("Team " + teamName + " scored " + totalGoals.ToString() + " goals in " + year);

        // Output expected:
        // Team Paris Saint - Germain scored 109 goals in 2013
        // Team Chelsea scored 92 goals in 2014
    }

    public static async Task<int> getTotalScoredGoals(string team, int year)
    {
        int total = 0;

        total += await GetGoalsFromMatches(team, year, isTeam1: true);
        total += await GetGoalsFromMatches(team, year, isTeam1: false);

        return total;
    }

    private static HttpClient CreateHttpClient()
    {
        var client = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(10)
        };
        client.DefaultRequestHeaders.UserAgent.ParseAdd("Questao2-GoalsApp");
        return client;
    }

    private static async Task<int> GetGoalsFromMatches(string team, int year, bool isTeam1)
    {
        string param = isTeam1 ? "team1" : "team2";
        string goalKey = isTeam1 ? "team1goals" : "team2goals";
        int totalGoals = 0;
        int page = 1;
        int totalPages = 1;

        do
        {
            string url = $"{ApiBase}?year={year}&{param}={Uri.EscapeDataString(team)}&page={page}";

            string json;
            try
            {
                json = await HttpClient.GetStringAsync(url);
            }
            catch (HttpRequestException ex)
            {
                throw new InvalidOperationException($"Erro ao chamar a API de partidas: {ex.Message}", ex);
            }

            var response = JObject.Parse(json);

            totalPages = (int)response["total_pages"]!;
            var data = (JArray)response["data"]!;

            foreach (var match in data)
            {
                string? goalsStr = match[goalKey]?.ToString();
                if (!string.IsNullOrEmpty(goalsStr) && int.TryParse(goalsStr, out int goals))
                    totalGoals += goals;
            }

            page++;
        } while (page <= totalPages);

        return totalGoals;
    }
}