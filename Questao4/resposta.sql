-- Questão 4: SELECT para atendimentos com mais de 3 ocorrências por assunto/ano
-- Ordenar por ANO decrescente e QUANTIDADE decrescente

select assunto as ASSUNTO, ano as ANO, COUNT(*) as QUANTIDADE
from atendimentos
group by assunto, ano
having COUNT(*) > 3
order by ano desc, quantidade desc;
